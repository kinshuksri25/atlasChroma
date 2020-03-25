//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for story object
class story{
    constructor({_id = randValueGenerator(), 
                name="",
                description="",
                contributor="",
                priority="",
                startdate="",
                duedate="",
                currentstatus="",
                comments=""}) {
        
        this._id = _id;              
        this.name=name;
        this.description=description;
        this.contributor=contributor;
        this.priority=priority;
        this.startdate=startdate;
        this.duedate=duedate;
        this.currentstatus=currentstatus;
        this.comments=comments;
    }

    getStoryDetails(){
        let storyObject={
            _id : this._id,
            name:this.name,
            description:this.description,
            contributor:this.contributor,
            priority:this.priority,
            startdate:this.startdate,
            currentstatus:this.currentstatus,
            duedate:this.duedate,
            comments:this.comments          
        }

        return storyObject;
    }

    setStoryObject({_id = this._id,
                   name=this.name,
                   description=this.description,
                   contributor=this.contributor,
                   priority=this.priority,
                   startdate=this.startdate,
                   currentstatus=this.currentstatus,
                   duedate=this.dueDate,
                   comments=this.comments}){

            this._id = _id;            
            this.name=name;
            this.description=description;
            this.contributor=contributor;
            this.priority=priority;
            this.startdate=startdate;
            this.currentstatus=currentstatus;
            this.duedate=duedate;
            this.comments=comments;        

    }
}

//export the module
module.exports = story;
