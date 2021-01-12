//Dependencies
const CronJob = require('cron').CronJob;
const mongo =  require('./data');
let cookieHandler = require('./cookieHandler');
const {generateCurrentDate,generateCurrentTime} = require('./helper');
const googleApis = require("../googleApis/googleAPI");
const {EMSG,SMSG,SINGLE,MULTIPLE,OAuthCONST,EMAILTEMPLATES,DBCONST} = require('../../../../lib/constants/contants');

//object definition
let cron = {};
   
cron.startJobs = () => {
    cron.chatBackup().start();
    cron.sendFailedEmail().start();
    cron.allDayEventReminder().start();
    cron.timedEventReminder().start();
    cron.deleteFinshedEvents().start();
    cron.updateProjectAndStoryStatus().start();
}

cron.updateProjectAndStoryStatus = () => {
    return new CronJob('0 0 * * *', function(){

        let currentDate = generateCurrentDate();
        let template = {storyName: "", projectName: ""};
        mongo.read(DBCONST.projectCollection,{},{}).then(resolvedResult => {
            resolvedResult.map(project => {
                if(project.duedate.substring(5,7) == currentDate.substring(5,7) && currentDate.substring(8,10) == project.duedate.substring(8,10)){
                    
                    mongo.read(DBCONST.userCollection,{username:{$in:[...project.contributors]}},{projection:{email:1,_id:0}}).then(userResult => { 
                        let contributorEmail = userResult.map(user => {return user.email});
                        template.projectName = project.title;
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,[...contributorEmail],OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.PROJOVERDUE,template).then(resolvedResult => {
                            console.log(resolvedResult);
                        }).catch(rejectedResult => {
                            throw rejectedResult;
                        }); 
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                }else{
                    mongo.read(DBCONST.userCollection,{username:{$in:[...project.contributors]}},{projection:{username : 1,email:1,_id:0}}).then(userResult => {
                          
                        project.storydetails.map(story => {
                            if(story.duedate.substring(5,7) == currentDate.substring(5,7) && currentDate.substring(8,10) == story.duedate.substring(8,10)){
                                let contributorEmail = [];
                                userResult.map(user => {
                                    if(story.contributor == user.username || project.projectlead == user.username){
                                        contributorEmail.push(user.email);
                                    }
                                });
                                template.projectName = project.title;
                                template.storyName = story.storytitle;
                                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,[...contributorEmail],OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.STYOVERDUE,template).then(resolvedResult => {
                                    console.log(resolvedResult);
                                }).catch(rejectedResult => {
                                    throw rejectedResult;
                                }); 
                            }
                        }); 
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });  
                }
                
            });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        });
    })
}

cron.chatBackup = () => {
    return new CronJob('0 0 * * *', function() {
        mongo.read(DBCONST.chatCollection,{},{projection : {conversationhistory : 1,participants : 1}}).then(resolvedResult => {
            let userList = [];
            let conversationDetails = [];
            let index = 0;
            resolvedResult.map(conversation => {
                if(conversation.conversationhistory.length != 0){
                    conversationDetails.push({participants:[],message:[],participantNames:[],participantsEmail:[]});
                    userList.indexOf(conversation.participants[0]) < 0 && userList.push(conversation.participants[0]);
                    userList.indexOf(conversation.participants[1]) < 0 && userList.push(conversation.participants[1]);
                    conversationDetails[index].participants.push(...conversation.participants);
                    conversationDetails[index].message = [...conversation.conversationhistory];
                    index++;
                }
            });
            if(conversationDetails.length != 0){
                mongo.read(DBCONST.userCollection,{"username" : {$in : [...userList]}},{projection : {username : 1, email : 1, firstname : 1, lastname : 1}}).then(resolvedResult => {

                    conversationDetails.map(convo => {
                        resolvedResult.map(result => {
                            if(convo.participants.indexOf(result.username) >= 0){
                                //add the names of the participants
                                convo.participantNames[convo.participants.indexOf(result.username)] = (result.firstname+" "+result.lastname);
                                //add the emails 
                                convo.participantsEmail[convo.participants.indexOf(result.username)] = (result.email);
                            }
                        });
                    });

                    conversationDetails.map(convo => {
                        let messages = [...convo.message];
                        convo.message = "";
                        messages.map(messageObj =>{
                            let sender = messageObj.sender == convo.participants[0] ? convo.participantNames[0] : convo.participantNames[1];
                            convo.message += sender+" : "+ messageObj.message+"<br>";
                        });
                        let template = {
                            participant1 : convo.participantNames[0],
                            participant2 : convo.participantNames[1],
                            history : convo.message
                        }
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,convo.participantsEmail,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.CONVOHISTORY,template).then(resolvedResult => {
                            console.log(resolvedResult);
                        }).catch(rejectedResult => {
                            throw rejectedResult;
                        });
                    });

                    // mongo.update(DBCONST.chatCollection,{},{$set: {conversationhistory : []}},{},MULTIPLE).then(resolvedResult => {
                    //     console.log(resolvedResult);
                    // }).catch(rejectedResult => {
                    //     throw rejectedResult;
                    // });
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            }
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        }); 
    }); 
};

cron.sendFailedEmail = () => {
    return new CronJob('0 */2 * * *', function() {
        mongo.read(DBCONST.failedEmailCollection,{},{}).then(resolvedResult => { 
            resolvedResult.map(mailDetails => {
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,mailDetails.payload.participants,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES[mailDetails.payload.template],mailDetails.payload.templateData).then(resolvedResult => {
                    mongo.delete(DBCONST.failedEmailCollection,{_id:mailDetails._id},{},SINGLE).then(resolvedResult => {
                        console.log(resolvedResult);
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        });
    });
};


cron.allDayEventReminder = () => {
    return new CronJob('0 0 * * *',function() {
        let userDetails = [];
        cookieHandler.getAllCookies().then(resolvedSet => {
            let usernames = Object.keys(resolvedSet);
            mongo.read(DBCONST.userCollection,{username : {$not :{$eq : [...usernames]}}},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
                userDetails = [...resolvedResult];
                userDetails.map(user => {
                    let currentEvents = [];
                    user.events.map(event => {
                        let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                        event.EventType == "All Day" && dueDate == generateCurrentDate() && currentEvents.push(event);
                    });
                    mongo.read(DBCONST.projectCollection,{_id : {$in : [...user.projects]}},{projection : {storydetails : 1, _id : 0, duedate : 1, title : 1, description : 1, contributors : 1}}).then(resolvedResult => {
                        let results = [];
                        resolvedResult.map(result => {
                            console.log(result);
                            let obj = {EventTitle:"",Description:""};
                            if(user.username == result.storydetails.contributor && generateCurrentDate() == result.storydetails.duedate ){
                                obj.EventTitle = result.storydetails.storytitle;
                                obj.Description = result.storydetails.description;
                                results.push(obj);
                            }
                            if(result.contributors.indexOf(user.username) >= 0 && generateCurrentDate() == result.duedate){
                                obj.EventTitle = result.title;
                                obj.Description = result.description;
                                results.push(obj);
                            }
                        });
                        let combinedEvents = [...currentEvents,...results];
                        if(combinedEvents.length > 0){
                            let events = "";
                            combinedEvents.map(event=>{
                                events += "EventName :"+ event.EventTitle +"<br>"+"Description :"+ event.Description+"<br> <br>";
                            });
                            let template = {
                                username : user.username,
                                events : events
                            };
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ALLDAYREMINDER,template).then(resolvedResult => {
                                console.log("All Day Email Reminder Sent!!");
                            }).catch(rejectedResult => {
                                throw rejectedResult;
                            });
                        }
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                });
            }).catch(rejectedResult => {    
                console.log(rejectedResult);
            });
        }).catch(rejectedSet =>{
            console.log(rejectedSet);
        });
    });
};

cron.timedEventReminder = () => {
    return new CronJob('0 */1 * * *', function() {
        let userDetails = [];
        cookieHandler.getAllCookies().then(resolvedSet => {
            let usernames = Object.keys(resolvedSet);
            mongo.read(DBCONST.userCollection,{username : {$not :{$eq : [...usernames]}}},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
                userDetails = [...resolvedResult];
                userDetails.map(user => {
                    let currentEvent = {};
                    user.events.map(event => {
                        let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                        if(event.EventType == "Timed" || event.EventType == "Meeting" && dueDate == generateCurrentDate()){
                            if(event.StartTime == generateCurrentTime()){
                                currentEvent = {...event};
                            }
                        }
                    });
                    if(currentEvent.length > 0){
                        let template = {
                            heading : currentEvent.EventType == "Meeting" ?  "You currently have the following meeting to attend" : "The following event is active in your scheduler for this current hour:",
                            username : user.username,
                            event : currentEvent
                        };
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.TIMEDREMINDER,template).then(resolvedResult => {
                            console.log("Timed Email Reminder Sent!!");
                        }).catch(rejectedResult => {
                            throw rejectedResult;
                        });
                        currentEvents = [];
                    }
                });
            }).catch(rejectedResult => {
                console.log(rejectedResult);
            });
        }).catch(rejectedSet => {

        });
    });
};

cron.deleteFinshedEvents = () => {
    return new CronJob('00 00 00 * * *',function(){
        let finishedEvents = [];
        mongo.read(DBCONST.userCollection,{},{projection : {events : 1}}).then(resolvedResult => {
            resolvedResult.map(user => {
                user.events.map(event => {
                    let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                    dueDate < generateCurrentDate() && finishedEvents.push(event._id);
                });
            });
            mongo.update(DBCONST.userCollection,{},{$pull : {events : {_id : {$in : [...finishedEvents]}}}},{},MULTIPLE).then(resolvedResult => {
            }).catch(rejectedResult => {
                throw rejectedResult;
            });
        }).catch(rejectedResult => {    
            console.log(rejectedResult);
        });
    });
};

//exporting the module
module.exports = cron;