//Dependencies
import store from '../../store/store';
import DateHelper from './date';
import setUserAction from '../../store/actions/userActions';
import setMsgAction from '../../store/actions/msgActions';
import updateTime from '../../store/actions/clockActions';

const clock = {};

clock.unsubscribe = store.subscribe( () => {});

clock.startClock = () => {
    setInterval(()=>{
        let state = store.getState();
        let previousTime = state.clockStateReducer.previousTime;
        let currentDateObject = new DateHelper().currentDateGenerator();
        let date= currentDateObject.year+"-"+currentDateObject.month+"-"+currentDateObject.date;
        let time  = currentDateObject.time;
        if(previousTime != time){
            let user = {...state.userStateReducer};
            user.events.map(event => {
                let eventName = event.EventType;
                let eventDate = event.CreationYear+"-"+event.CreationMonth+"-"+event.CreationDate;  
                if(event.EventType != "All Day"){  
                    if(eventDate < date){
                        event.status = "finished";
                    }else if(eventDate > date){
                        event.status = "YettoStart";
                    }else{
                        if(event.StartTime > time){
                            event.status = "YettoStart";                          
                        }else if(event.StartTime < time && event.EndTime <= time){
                            event.status = "finished"
                        }else if(event.StartTime <= time && event.EndTime >= time){
                            event.status != "CurrentlyActive" && store.dispatch(setMsgAction({msg: eventName+", has started" ,status:"SUCCESS"}));
                            event.status = "CurrentlyActive"
                        }
                    }
                }else{
                    event.status == eventDate > date ? "YettoStart" : eventDate < date ? "finished" : "CurrentlyActive";
                }
            });
            store.dispatch(setUserAction({...user}));
            store.dispatch(updateTime(time));
        }

    },1000);
}

export default clock;