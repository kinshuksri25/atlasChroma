//Dependencies
const {randValueGenerator,generateCurrentDate} = require("../utils/helper");

//Blueprint for story object
class story{
    constructor({_id = randValueGenerator(), 
                storytitle="",
                description="",
                contributor="",
                priority="",
                startdate= generateCurrentDate(),
                duedate="",
                currentstatus="",
                comments="",
                status=""}) {
        
        this._id = _id;              
        this.storytitle=storytitle;
        this.description=description;
        this.contributor=contributor;
        this.priority=priority;
        this.startdate=startdate;
        this.duedate=duedate;
        this.currentstatus=currentstatus;
        this.comments=comments;
        this.status=status;
    }

    getStoryDetails(){
        let storyObject={
            _id : this._id,
            storytitle:this.storytitle,
            description:this.description,
            contributor:this.contributor,
            priority:this.priority,
            startdate:this.startdate,
            currentstatus:this.currentstatus,
            duedate:this.duedate,
            comments:this.comments,
            status:this.status          
        }

        return storyObject;
    }

    setStoryObject({_id = this._id,
                    storytitle=this.storytitle,
                   description=this.description,
                   contributor=this.contributor,
                   priority=this.priority,
                   startdate=this.startdate,
                   currentstatus=this.currentstatus,
                   duedate=this.dueDate,
                   comments=this.comments,
                   status=this.status}){

            this._id = _id;            
            this.storytitle=storytitle;
            this.description=description;
            this.contributor=contributor;
            this.priority=priority;
            this.startdate=startdate;
            this.currentstatus=currentstatus;
            this.duedate=duedate;
            this.comments=comments;    
            this.status=status;    

    }
}

//export the module
module.exports = story;
