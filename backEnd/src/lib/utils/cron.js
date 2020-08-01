//Dependencies
const CronJob = require('cron').CronJob;
const mongo =  require('./data');
const {generateCurrentDate} = require('./helper');
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
            resolvedResult.map(conversation => {
                userList.indexOf(conversation.participants[0]) >= 0 && userList.push(conversation.participants[0]);
                userList.indexOf(conversation.participants[1]) >= 0 && userList.push(conversation.participants[1]);
                conversationDetails.participants = [...conversation.participants];
                conversation.conversationhistory.map(convo => {
                    conversationDetails.message.push(convo.sender+" : "+convo.message);
                });
            });
            mongo.read(DBCONST.userCollection,{$in : {"username" : [...userList]}},{projection : {username : 1, email : 1}}).then(resolvedResult => {
                resolvedResult.map(result => {
                    conversationDetails.map(convo => {
                        convo.participants.indexOf[result.username] >= 0 && convo.participants.splice(convo.participants.indexOf[result.username],1,resolvedResult.email);
                    });
                });

                conversationDetails.map(convo => {
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,convo.participants,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDEVENT).then(resolvedResult => {
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
            resolvedResult.map(mailDetails => {
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
        let finishedEvents = [];
        mongo.read(DBCONST.userCollection,{},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
            userDetails = [...resolvedResult];
            userDetails.map(user => {
                user.events(event => {
                    let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                    event.EventType == "AllDay" && dueDate == generateCurrentDate() && user.event.push(event);
                    event.EventType == "AllDay" && dueDate > generateCurrentDate() && finishedEvents.push(event);
                });
                mongo.read(DBCONST.projectCollection,{$and : [{_id : {$in : [...user.projects]}},{"storydetails.contributor" : user.username}]},{projection : {storydetails : 1}}).then(resolvedResult => {
                    user.stories = resolvedResult[0];
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDEVENT).then(resolvedResult => {
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
        let finishedEvents = [];
        mongo.read(DBCONST.userCollection,{},{projection : {username : 1,email : 1,projects : 1,events : 1}}).then(resolvedResult => {
            userDetails = [...resolvedResult];
            userDetails.map(user => {
                user.events(event => {
                    let dueDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;
                    if(event.EventType == "Timed" || event.EventType == "Meeting"){
                        if(dueDate == generateCurrentDate()){
                            user.event.push(event);
                        }else if(dueDate > generateCurrentDate()){
                            finishedEvents.push(event);
                        }
                    }
                    googleApis.sendEmail(OAuthCONST.appAuth.senderEmail,user.email,OAuthCONST.appAuth.sendEmailRefreshToken,OAuthCONST.appAuth.clientID,OAuthCONST.appAuth.clientSecret,EMAILTEMPLATES.ADDEVENT).then(resolvedResult => {
                        console.log(resolvedResult);
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
});
};

//exporting the module
module.exports = cron;