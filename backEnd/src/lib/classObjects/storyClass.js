//Blueprint for story object
class story{
    constructor(name="",
                description="",
                contributors="",
                storyPoints="",
                priority="",
                startDate="",
                dueDate="",
                initialComments="") {
                    
        this.name=name;
        this.description=description;
        this.contributors=contributors;
        this.storyPoints=storyPoints;
        this.priority=priority;
        this.startDate=startDate;
        this.dueDate=dueDate;
        this.initialComments=initialComments;
    }

    getStoryDetails(){
        let storyObject={
            name:this.name,
            description:this.description,
            contributors:this.contributors,
            storyPoints:this.storyPoints,
            priority:this.priority,
            startDate:this.startDate,
            dueDate:this.dueDate,
            initialComments:this.initialComments          
        }

        return storyObject;
    }

    setStoryObject(name=this.name,
                   description=this.description,
                   contributors=this.contributors,
                   storyPoints=this.storyPoints,
                   priority=this.priority,
                   startDate=this.startDate,
                   dueDate=this.dueDate,
                   initialComments=this.initialComments){

            this.name=name;
            this.description=description;
            this.contributors=contributors;
            this.storyPoints=storyPoints;
            this.priority=priority;
            this.startDate=startDate;
            this.dueDate=dueDate;
            this.initialComments=initialComments;        

    }
}

//export the module
module.exports = story;
