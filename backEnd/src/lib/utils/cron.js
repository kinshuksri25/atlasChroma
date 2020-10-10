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
}

cron.chatBackup = () => {
    return new CronJob('0 0 * * *', function() {
        mongo.read(DBCONST.chatCollection,{},{projection : {conversationhistory : 1,participants : 1}}).then(resolvedResult => {
            let userList = [];
            let conversationDetails = [];
            let index = 0;
            resolvedResult.map(conversation => {
                conversationDetails.push({participants:[],message:[]});
                userList.indexOf(conversation.participants[0]) < 0 && userList.push(conversation.participants[0]);
                userList.indexOf(conversation.participants[1]) < 0 && userList.push(conversation.participants[1]);
                conversationDetails[index].participants.push(...conversation.participants);
                conversation.conversationhistory.map(convo => {
                    conversationDetails[index].message.push(convo.sender+" : "+convo.message);
                });
                index++;
            });
            mongo.read(DBCONST.userCollection,{"username" : {$in : [...userList]}},{projection : {username : 1, email : 1}}).then(resolvedResult => {
                resolvedResult.map(result => {
                    conversationDetails.map(convo => {
                        convo.participants.indexOf(result.username) >= 0 && convo.participants.splice(convo.participants.indexOf(result.username),1,result.email);
                    });
                });
                conversationDetails.map(convo => {
                    let template = {
                        participant1 : convo.participants[0],
                        participant2 : convo.participants[1],
                        history : convo.message
                    }
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,convo.participants,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.CONVOHISTORY,template).then(resolvedResult => {
                        console.log(resolvedResult);
                    }).catch(rejectedResult => {
                        throw rejectedResult;
                    });
                });
                mongo.update(DBCONST.chatCollection,{},{$set: {conversationhistory : []}},{},MULTIPLE).then(resolvedResult => {
                    console.log(resolvedResult);
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            }).catch(rejectedResult => {
                throw rejectedResult;
            });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        }); 
    }); 
};

cron.sendFailedEmail = () => {
    return new CronJob('0 */2 * * *', function() {
        mongo.read(DBCONST.failedEmailCollection,{},{}).then(resolvedResult => { 
            resolvedResult.map(mailDetails => {
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,mailDetails.participants,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES[mailDetails.template],mailDetails.templateData).then(resolvedResult => {
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
                    mongo.read(DBCONST.projectCollection,{_id : {$in : [...user.projects]}},{projection : {storydetails : 1, _id : 0}}).then(resolvedResult => {
                        let results = [];
                        resolvedResult.map(result => {
                            user.username == result.contributor && generateCurrentDate() == result.storydetails.duedate && results.push(result);
                        });
                        let combinedEvents = [...currentEvents,...results];
                        let template = {
                            username : user.username,
                            events : [...combinedEvents]
                        };
                        if(combinedEvents.length > 0)
                            googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ALLDAYREMINDER,template).then(resolvedResult => {
                                console.log("All Day Email Reminder Sent!!");
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
                console.log("All finished events have been deleted");
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