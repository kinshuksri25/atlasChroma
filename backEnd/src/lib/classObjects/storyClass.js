//Blueprint for story object
class story{
    constructor(name="",
                description="",
                contributors="",
                storypoints="",
                priority="",
                startdate="",
                duedate="",
                initialcomments="") {
                    
        this.name=name;
        this.description=description;
        this.contributors=contributors;
        this.storypoints=storypoints;
        this.priority=priority;
        this.startdate=startdate;
        this.duedate=duedate;
        this.initialcomments=initialcomments;
    }

    getStoryDetails(){
        let storyObject={
            name:this.name,
            description:this.description,
            contributors:this.contributors,
            storypoints:this.storypoints,
            priority:this.priority,
            startdate:this.startdate,
            duedate:this.duedate,
            initialcomments:this.initialcomments          
        }

        return storyObject;
    }

    setStoryObject(name=this.name,
                   description=this.description,
                   contributors=this.contributors,
                   storypoints=this.storypoints,
                   priority=this.priority,
                   startdate=this.startdate,
                   dueDate=this.dueDate,
                   initialcomments=this.initialcomments){

            this.name=name;
            this.description=description;
            this.contributors=contributors;
            this.storypoints=storypoints;
            this.priority=priority;
            this.startdate=startdate;
            this.duedate=duedate;
            this.initialcomments=initialcomments;        

    }
}

//export the module
module.exports = story;
