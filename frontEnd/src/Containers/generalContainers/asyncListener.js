//Dependencies
import store from '../../store/store';
import setUserListStateAction from '../../store/actions/userListActions';
import setUserAction from '../../store/actions/userActions';
import updatetime from '../../store/actions/clockActions';

const listener = {};

listener.unsubscribe = store.subscribe( () => {});

listener.listenEvents = (io) => {
    io.on("updatingDetails", (details) => {
        let state = store.getState();
        let userList = [...state.userListStateReducer];
        let user = {...state.userStateReducer};
        let index = 0;
        
        switch(details.event){
            case "getUserList" :
                store.dispatch(setUserListStateAction([...details.data]));
                break; 

            case "addingUser" :
                userList.push({...details.data});
                store.dispatch(setUserListStateAction([...userList]));
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
                        user.username = details.data.username;
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
                index = 0;
                break;
            case "addingStory" :
                user.projects.map(project => {
                    console.log(details.data);
                    if(project._id == details.data.projectID)
                    {
                        console.log("called");
                        delete details.data.projectID;
                        project.storydetails.push({...details.data});
                    }
                });
                store.dispatch(setUserAction({...user}));
                break;   
            case "updatingStory" :
                user.projects.map(project => {
                    if(project._id == details.data.projectID){
                        project.storydetails.map(story => {
                            if(story._id == details.data._id){
                                delete details.data.projectID;
                                story.storytitle = details.data.storytitle;
                                story.comments = details.data.comments;
                                story.contributor = details.data.contributor;
                                story.currentstatus = details.data.currentstatus;
                                story.duedate = details.data.duedate;
                                story.priority = details.data.priority;
                                story.description = details.data.description;
                                story.status = details.data.status;
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
                index = 0;
                break;                        
            case "addingProject" : 
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.push(details.data.body);
                    store.dispatch(setUserAction({...user}));
                }
                break;
            case "editingProject" :
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.map(project => {
                        if(project._id == details.data._id){
                            project.templatedetails = details.data.templatedetails;
                            project.title = details.data.title;
                            project.projectlead = details.data.projectlead;
                            project.description = details.data.description;
                            project.duedate = details.data.duedate;
                            project.contributors = [...details.data.contributors];
                            project.status = details.data.status;
                        }
                    });
                    store.dispatch(setUserAction({...user}));     
                }
                break;
            case "deletingProject" :
                if(details.data.contributors.indexOf(user.username) >= 0){
                    user.projects.map(project => {
                        if(project._id == details.data._id ){
                            user.projects.splice(index,1);
                            store.dispatch(setUserAction({...user}));
                        }else{
                            index++;
                        }
                    });
                }
                index = 0;
                break;
            case "addingMeeting" :
                if(details.data.participants.indexOf(user.username) >= 0){
                    user.events.push({...details.data});
                    store.dispatch(setUserAction({...user}));
                    store.dispatch(updatetime(""));
                }
                break;
            case "editingMeeting" :
                if(details.data.participants.indexOf(user.username) >= 0){
                    user.events.map(event => {
                        if(event._id == details.data._id){
                            event.Description = details.data.Description;
                            event.EndTime = details.data.EndTime;
                            event.EventTitle = details.data.EventTitle;
                            event.StartTime = details.data.StartTime;
                            event.participants = [...details.data.participants];
                        }
                    });
                    store.dispatch(setUserAction({...user}));
                    store.dispatch(updatetime(""));
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
                index = 0;    
                break; 
        }   
        
    });
}

export default listener;