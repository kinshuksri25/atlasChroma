//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for story object
class story{
    constructor({_id = randValueGenerator(), 
                name="",
                description="",
                contributors="",
                storypoints="",
                priority="",
                startdate="",
                duedate="",
                comments=""}) {
        
        this._id = _id;              
        this.name=name;
        this.description=description;
        this.contributors=contributors;
        this.storypoints=storypoints;
        this.priority=priority;
        this.startdate=startdate;
        this.duedate=duedate;
        this.comments=comments;
    }

    getStoryDetails(){
        let storyObject={
            _id : this._id,
            name:this.name,
            description:this.description,
            contributors:this.contributors,
            storypoints:this.storypoints,
            priority:this.priority,
            startdate:this.startdate,
            duedate:this.duedate,
            comments:this.comments          
        }

        return storyObject;
    }

    setStoryObject({_id = this._id,
                   name=this.name,
                   description=this.description,
                   contributors=this.contributors,
                   storypoints=this.storypoints,
                   priority=this.priority,
                   startdate=this.startdate,
                   dueDate=this.dueDate,
                   comments=this.comments}){

            this._id = _id;            
            this.name=name;
            this.description=description;
            this.contributors=contributors;
            this.storypoints=storypoints;
            this.priority=priority;
            this.startdate=startdate;
            this.duedate=duedate;
            this.comments=comments;        

    }
}

//export the module
module.exports = story;
