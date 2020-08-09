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
}

cron.chatBackup = () => {
    return new CronJob('00 00 00 * * *', function() {
        mongo.read(DBCONST.chatCollection,{"conversationhistory" : {$size : {$gt : 0}}},{projection : {conversationhistory : 1,participants : 1}}).then(resolvedResult => {
            let userList = [];
            let conversationDetails = [];
            let index = 0;
            resolvedResult[0].map(conversation => {
                userList.indexOf(conversation.participants[0]) >= 0 && userList.push(conversation.participants[0]);
                userList.indexOf(conversation.participants[1]) >= 0 && userList.push(conversation.participants[1]);
                conversationDetails[index].participants = [...conversation.participants];
                conversation.conversationhistory.map(convo => {
                    conversationDetails[index].message.push(convo.sender+" : "+convo.message);
                });
                index++;
            });
            mongo.read(DBCONST.userCollection,{$in : {"username" : [...userList]}},{projection : {username : 1, email : 1}}).then(resolvedResult => {
                resolvedResult[0].map(result => {
                    conversationDetails.map(convo => {
                        convo.participants.indexOf[result.username] >= 0 && convo.participants.splice(convo.participants.indexOf[result.username],1,resolvedResult.email);
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
                mongo.update(DBCONST.chatCollection,{"conversationhistory" : {$size : {$gt : 0}}},{$set: {conversationhistory : []}},{},MULTIPLE).then(resolvedResult => {
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
    return new CronJob('0 */60 * * * *', function() {
        mongo.read(DBCONST.failedEmailCollection,{},{}).then(resolvedResult => {
            resolvedResult[0].map(mailDetails => {
                googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,mailDetails.participants,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES[mailDetails.template],mailDetails.templateData).then(resolvedResult => {
                    console.log(resolvedResult);
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            });
            mongo.delete(DBCONST.failedEmailCollection,{},{},MULTIPLE).then(resolvedResult => {
                console.log(resolvedResult);
            }).catch(rejectedResult => {
                throw rejectedResult;
            });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        });
    });
};

cron.allDayEventReminder = () => {
    return new CronJob('00 00 00 * * *',function() {
        let userDetails = [];
        let currentEvents = [];
        let finishedEvents = [];
        mongo.read(DBCONST.userCollection,{},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
            userDetails = [...resolvedResult[0]];
            userDetails.map(user => {
                user.events(event => {
                    let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                    event.EventType == "AllDay" && dueDate == generateCurrentDate() && currentEvents.push(event);
                    event.EventType == "AllDay" && dueDate > generateCurrentDate() && finishedEvents.push(event);
                });
                mongo.read(DBCONST.projectCollection,{$and : [{_id : {$in : [...user.projects]}},{"storydetails.contributor" : user.username}]},{projection : {storydetails : 1, _id : 0}}).then(resolvedResult => {
                    currentEvents = [...currentEvent,...resolvedResult[0]];
                    let template = {
                        username : user.username,
                        events : [...currentEvents]
                    };
                    if(currentEvents.length > 0)
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ALLDAYREMINDER,template).then(resolvedResult => {
                            console.log(resolvedResult);
                        }).catch(rejectedResult => {
                            throw rejectedResult;
                        });
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
                mongo.update(DBCONST.userCollection,{_id : user._id},{$pull : {events : {$in : [...finishedEvents]}}},{},SINGLE).then(resolvedResult => {
                    console.log(resolvedResult);
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
            });
        }).catch(rejectedResult => {    
            console.log(rejectedResult);
        });
    });
};

cron.timedEventReminder = () => {
    return new CronJob('0 */60 * * * *', function() {
        let userDetails = [];
        let currentEvent = {};
        let finishedEvents = [];
        mongo.read(DBCONST.userCollection,{},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
            userDetails = [...resolvedResult];
            userDetails.map(user => {
                cookieHandler.getCookie(user.username).then(resolvedResult => {
                    if(resolvedResult){
                        user.events(event => {
                            let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                            if(event.EventType == "Timed" || event.EventType == "Meeting" && dueDate == generateCurrentDate()){
                                if(event.StartTime == generateCurrentTime()){
                                    currentEvent = {...event};
                                }else if(event.EndTime ==  generateCurrentTime()){
                                    finishedEvents.push(event);
                                }
                            }
                        });
                        let template = {
                            username : user.username,
                            event : currentEvent
                        };
                        googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.TIMEDREMINDER,template).then(resolvedResult => {
                            console.log(resolvedResult);
                        }).catch(rejectedResult => {
                            throw rejectedResult;
                        });
                    }
                }).catch(rejectedResult => {
                    console.log(rejectedResult)
                });
                mongo.update(DBCONST.userCollection,{_id : user._id},{$pull : {events : {$in : [...finishedEvents]}}},{},SINGLE).then(resolvedResult => {
                    console.log(resolvedResult);
                }).catch(rejectedResult => {
                    throw rejectedResult;
                });
        }).catch(rejectedResult => {
            console.log(rejectedResult);
        });
    });
});
};

//exporting the module
module.exports = cron;