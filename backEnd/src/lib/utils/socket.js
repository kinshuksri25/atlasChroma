//File handling server side socket connections

//Dependencies
const cookieHandler = require('./cookieHandler');
const mongo = require('./data');
const {generateCurrentDate} = require("./helper");
const {SINGLE,DBCONST,EMSG,SMSG} = require("../../../../lib/constants/contants");

//declaring the module
let socket = {};

socket.handleEvents = (io) =>{
    let socketObject = {};
    io.on("connection", (socket) => {
        socket.on("login", (userID) => {
            cookieHandler.getCookie(userID).then(resolvedResult => {
                console.log("User "+resolvedResult+" connected with socketID: "+socket.id);
                socketObject[resolvedResult] = socket.id;
                io.clients((error, clients) => {
                    if (error) throw error;
                    console.log(clients); 
                  });
            }).catch(rejectedResult => {
                console.log(rejectedResult);
            });
        })

        socket.on("generateRoomName",(data) => {
            let privateRoomName = "";
            let recipientSocketID = socketObject[data.recipientUserName];

            if(data && data.hasOwnProperty("senderUserName") && data.hasOwnProperty("recipientUserName")){    
                mongo.read(DBCONST.chatCollection,{participants:{$all : [data.senderUserName,data.recipientUserName]}},{}).then(resolvedResult => {
                    //new roomName
                    if(resolvedResult.length == 0){
                        privateRoomName = data.senderUserName+"-"+data.recipientUserName;
                        socket.join(privateRoomName,() =>{
                            console.log(EMSG.SVR_UTL_SNDSUC+privateRoomName);  
                        }); 

                        let messageObject = {
                            roomname : privateRoomName,
                            participants : [data.senderUserName,data.recipientUserName],
                            creationdate : generateCurrentDate(),
                            conversationhistory : []
                        }

                        //add the roomName to the collection 
                        mongo.insert(DBCONST.chatCollection,{...messageObject},{}).then(resolvedResult => {
                            console.log(SMSG.SVR_UTL_RMNSUC);
                        }).catch(rejectedResult => {
                            console.log(rejectedResult);
                        });
                    }else{
                        privateRoomName = resolvedResult[0].roomname;
                        !socket.rooms.hasOwnProperty(privateRoomName) && socket.join(privateRoomName,() =>{console.log("sender has joined the room "+privateRoomName);}); 
                    }
                    
                    let genData = { roomName : privateRoomName, 
                                    recipientUserName : data.recipientUserName, 
                                    senderUserName : data.senderUserName };
            
                    socket.emit("setRoom",{...genData});
                    socketObject.hasOwnProperty(data.recipientUserName) && socket.broadcast.to(recipientSocketID).emit("setRoom",{...genData});

                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
           }else{
               console.log(EMSG.SVR_UTL_SOCMSGERR);
           }
        });

        socket.on("joinRoom",(data) => {
            if(!socket.rooms.hasOwnProperty(data.roomName) && !socket.rooms.hasOwnProperty(data.senderUserName+"-"+data.recipientUserName)){
                socket.join(data.roomName,() => {
                    console.log(EMSG.SVR_UTL_RVRSUC);
                });
            }else{
                console.log(EMG.SVR_UTL_RVRPRESUC);
            }
        });

        socket.on("sendMessage",(data)=>{
            if(data && data.hasOwnProperty("roomName") && data.hasOwnProperty("messageObject")){
                io.to(data.roomName).emit('setMessage', data);
                mongo.update(DBCONST.chatCollection,{roomname : data.roomName},{$push : {"conversationhistory" : {...data.messageObject}}},{},SINGLE).then(updatedSet => {
                    console.log(SMSG.SVR_UTL_MSGUPTSUC);
                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
            }else{
                console.log(EMSG.SVR_UTL_MSGBDYERR);
            }
        });

        socket.on("deliverMsgs",data => {
            if(data && data.hasOwnProperty("senderUserName") && data.hasOwnProperty("recipientUserName")){   
                 mongo.update(DBCONST.chatCollection,{$and : [{participants:{$all : [data.senderUserName,data.recipientUserName]}},
                                {conversationhistory: {$elemMatch: {recipient : data.senderUserName,msgDelivered : false}}}]},{$set : {"conversationhistory.$[].msgDelivered" : true}},{},SINGLE).then(resolvedResult => {
                    console.log(SMSG.SVR_UTL_DLVRMSGSUC);                
                 }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
            }else{
                console.log(EMSG.SVR_UTL_INCDTAERR);
            }
        });

        socket.on("getMessages",(userName)=>{
           if(userName){
                mongo.read(DBCONST.chatCollection,{ participants: userName },{projections : {_id : 0, participants : 0, creationdate : 0}}).then(resolvedSet => {
                    let messageObject = {};
                    resolvedSet.map(convohistory => {
                        messageObject[convohistory.roomname] = [...convohistory.conversationhistory];
                    });
                    socket.emit("setMessages",messageObject);
                }).catch(rejectedSet => {
                    console.log(rejectedSet);
                });
           }else{
               console.log(EMSG.SVR_UTL_MISUSRERR);
           }
        });

        socket.on("terminate", (data) => {
            if(data.hasOwnProperty("cookieID")){
                console.log(data);
                cookieHandler.deleteCookie(data.cookieID).then(loginObject => {
                    delete socketObject[data.username];
                    let valueArray = Object.values(loginObject);
                    mongo.read(DBCONST.userCollection,{username : {$in : [...valueArray]}},{projection:{_id:0, username:1,email: 1,firstname: 1,lastname: 1}}).then(resolvedResult => {
                        io.emit("updatingDetails",{event : "getUserList", data : [...valueArray]});
                        socket.disconnect();
                    }).catch(rejectedResult => {
                        console.log(rejectedResult);
                    });
                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
            }else{
                console.log(EMSG.SVR_UTL_RDSUNKEYERR);
            }
        });
    });
}

module.exports = socket;