//Dependencies
import store from '../../store/store';
import setUserListStateAction from '../../store/actions/userListActions';
import setUserAction from '../../store/actions/userActions';

const listener = {};

const unsubscribe = store.subscribe( () => {});

listener.listenEvents = (io) => {
    io.on("updatingDetails", (details) => {
        let state = store.getState();
        let userList = [...state.userListStateReducer];
        let user = {...state.userStateReducer};
        let index = -1;
        
        switch(details.event){
            case "addingUser" :
                let userDetail = {
                    firstname : details.data.firstname,
                    lastname : details.data.lastname,
                    email : details.data.email
                }
                userList.push({...userDetail});
                store.dispatch(setUserListStateAction([...userList]));
                break;
            
            case "getUserList" :
                store.dispatch(setUserListStateAction([...details.data]));
                break; 

            case "updatingUser" :
                if(details.data.username == user.username){
                    user.firstname = details.data.firstname;
                    user.lastname = details.data.lastname;
                    user.phonenumber = details.data.phonenumber;
                    user.photo = details.data.photo;
                    store.dispatch(setUserAction({...user}));
                }
                userList.map(user => {
                    if(details.data.username == user.username){
                        user.firstname = details.data.firstname;
                        user.lastname = details.data.lastname;
                        user.email = details.data.email;
                    }
                });
                store.dispatch(setUserListStateAction([...userList]));
                break;
                
            case "deleteingUser" : 
                userList.map(user => {
                    if(user.username == details.data.username){
                        userList.splice(index,1);
                        store.dispatch(setUserListStateAction([...userList]));
                    }else{
                        index++;
                    }
                });
                index = -1;
                break;
            case "addingStory" :
                user.projects.map(project => {
                    project._id == details.data.projectID && project.storydetails.push({...details.data});
                });
                store.dispatch(setUserAction({...user}));
                break;   
            case "updatingStory" :
                user.projects.map(project => {
                    if(project._id == details.data.projectID){
                        project.storydetails.map(story => {
                            if(story._id == details.data._id){
                                story = {...details.data};
                            }
                        });
                    }
                });
                store.dispatch(setUserAction({...user}));  
                break;
            case "deletingStory" :
                user.projects.map(project => {
                    if(project._id == details.data.projectID){
                        project.storydetails.map(story =>{
                            if(details.data.storyID == story._id){
                                project.storydetails.splice(index,1);
                                store.dispatch(setUserAction({...user}));
                            }else{
                                index ++;
                            }
                        });
                    }
                });
                index = -1;
                break;                        
            case "addingProject" : 
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.push(details.data);
                    store.dispatch(setUserAction({...user}));
                }
                break;
            case "editingProject" :
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.map(project => {
                        if(project._id == details.data._id){
                            project = {...details.data};
                        }
                    });
                    store.dispatch(setUserAction({...user}));     
                }
                break;
            case "deletingProject" :
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.map(project => {
                        if(project._id == details.data.projectID ){
                            user.projects.splice(index,1);
                            store.dispatch(setUserAction({...user}));
                        }else{
                            index++;
                        }
                    });
                }
                index = -1;
                break;
            case "addingMeeting" :
                if(details.data.participants.indexOf(user.username) >= 0){
                    user.events.push({...details.data});
                    store.dispatch(setUserAction({...user}));
                }
                break;
            case "editingMeeting" :
                if(details.data.participants.indexOf(user.username) >= 0){
                    user.events.map(event => {
                        event = event._id == details.data._id ? {...details.data} : event;
                    });
                    store.dispatch(setUserAction({...user}));
                }
                break;
            case "deletingMeeting" :
                if(details.data.participants.indexOf(user.username) >= 0){  
                    user.events.map(event => {
                        if(event._id == details.data._id){
                            user.events.splice(index,1);
                            store.dispatch(setUserAction({...user}));
                        }else{
                            index++;
                        }
                    });
                }
                index = -1;    
                break;   
        }   
    });
}

module.exports = listener;