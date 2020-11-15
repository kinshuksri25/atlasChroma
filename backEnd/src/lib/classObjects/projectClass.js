//Dependencies
const {randValueGenerator,generateCurrentDate} = require("../utils/helper");

//Blueprint for project objects
class project{

    constructor({_id = randValueGenerator(),
                title="",
                description="",
                projectlead="",
                contributors=[], 
                creationdate= generateCurrentDate(),
                modificationdate="",
                templatedetails = {},
                storydetails = [],
                duedate = "",
                status = "InProgress"}){
        
        this._id = _id;                    
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.contributors=contributors;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
        this.templatedetails = templatedetails;
        this.storydetails = storydetails;
        this.duedate = duedate;
        this.status = status;
    }

    getProjectDetails(){
        let projectDetails={
            _id : this._id,
            title:this.title,
            description:this.description,
            projectlead:this.projectlead,
            contributors:this.contributors,
            creationdate:this.creationdate,
            modificationdate:this.modificationdate,
            templatedetails:this.templatedetails,
            storydetails:this.storydetails,
            duedate:this.duedate,
            status: this.status
        } 
        return {...projectDetails};
    }

    setProjectDetails({_id = this._id,
                      title=this.title,
                      description=this.description,
                      projectlead=this.projectlead,
                      contributors=this.contributors,
                      creationdate=this.creationdate,
                      modificationdate=this.modificationdate,
                      templatedetails=this.templatedetails,
                      storydetails=this.storydetails,
                      duedate=this.duedate,
                      status=this.status}){

        this._id = _id;                
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.conbtributors=contributors;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
        this.templatedetails=templatedetails;
        this.storydetails=storydetails;
        this.duedate=duedate;
        this.status=status;
    }
}

//export the module
module.exports = project;
