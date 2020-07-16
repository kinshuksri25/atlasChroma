//File handling server side socket connections

//Dependencies
const cookieHandler = require('./cookieHandler');
const mongo = require('./data');
const {generateCurrentDate} = require("./helper");
const {SINGLE,DBCONST} = require("../../../../lib/constants/contants");

//declaring the module
let socket = {};

socket.handleEvents = (io) =>{
    let socketObject = {};

    io.on("connection", (socket) => {
        socket.on("login", (userID) => {
            cookieHandler.getCookie(userID).then(resolvedResult => {
                console.log("User "+resolvedResult+" connected with socketID: "+socket.id);
                socketObject[resolvedResult] = socket.id;

            }).catch(rejectedResult => {
                console.log("Invalid cookie passed");
            });
        })

        socket.on("refreshUserStatus", () => {
            cookieHandler.getAllCookies().then(userCookies => {
                let valueArray = [];
                for(let cookieKey in userCookies){
                    valueArray.push(userCookies[cookieKey]);
                }
                socket.broadcast.emit("refreshedUserStatus",valueArray);
            }).catch(rejectedResult => {
                console.log(rejectedResult);
            });
        });

        socket.on("generateRoomName",(data) => {
            let privateRoomName = "";
            let recipientSocketID = socketObject[data.recipientUserName];

            if(data && data.hasOwnProperty("senderUserName") && data.hasOwnProperty("recipientUserName")){    
                mongo.read(DBCONST.chatCollection,{participants:{$all : [data.senderUserName,data.recipientUserName]}},{}).then(resolvedResult => {
                    //new roomName
                    if(resolvedResult.length == 0){
                        privateRoomName = data.senderUserName+"-"+data.recipientUserName;
                        socket.join(privateRoomName,() =>{
                            console.log("sender has joined the room "+privateRoomName);  
                        }); 

                        let messageObject = {
                            roomname : privateRoomName,
                            participants : [data.senderUserName,data.recipientUserName],
                            creationdate : generateCurrentDate(),
                            conversationhistory : []
                        }

                        //add the roomName to the collection 
                        mongo.insert(DBCONST.chatCollection,{...messageObject},{}).then(resolvedResult => {
                            console.log("entry created");
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
               console.log("incomplete data provided");
           }
        });

        socket.on("joinRoom",(data) => {
            if(!socket.rooms.hasOwnProperty(data.roomName) && !socket.rooms.hasOwnProperty(data.senderUserName+"-"+data.recipientUserName)){
                socket.join(data.roomName,() => {
                    console.log("reciever joining room");
                });
            }else{
                console.log("reciever not joining room ID exists");
            }
        });

        socket.on("sendMessage",(data)=>{
            if(data && data.hasOwnProperty("roomName") && data.hasOwnProperty("messageObject")){
                io.to(data.roomName).emit('setMessage', data);
                mongo.update(DBCONST.chatCollection,{roomname : data.roomName},{$push : {"conversationhistory" : {...data.messageObject}}},{},SINGLE).then(updatedSet => {
                    console.log("conversation history updated");
                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
            }else{
                console.log("invalid message body");
            }
        });

        socket.on("deliverMsgs",data => {
            if(data && data.hasOwnProperty("senderUserName") && data.hasOwnProperty("recipientUserName")){   
                 mongo.update(DBCONST.chatCollection,{$and : [{participants:{$all : [data.senderUserName,data.recipientUserName]}},
                                {conversationhistory: {$elemMatch: {recipient : data.senderUserName,msgDelivered : false}}}]},{$set : {"conversationhistory.$[].msgDelivered" : true}},{},SINGLE).then(resolvedResult => {
                    console.log("all messages have been delivered");                
                 }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
            }else{
                console.log("incomplete data provided");
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
               console.log("userName not provided");
           }
        });

        socket.on("terminate", (data) => {
            if(data.hasOwnProperty("cookieID")){
                cookieHandler.deleteCookie(data.cookieID).then(loginObject => {
                    delete socketObject[data.username];
                    let valueArray = [];
                    for(let key in loginObject){
                        valueArray.push(loginObject[key]);
                    }
                    socket.broadcast.emit("refreshedUserStatus",valueArray);
                }).catch(rejectedResult => {
                    console.log(rejectedResult);
                });
                socket.disconnect();
            }else{
                console.log("cookieID unavailable");
            }
        });
    });
}

module.exports = socket;