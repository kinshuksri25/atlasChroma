//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for project objects
class project{

    constructor(_id = randValueGenerator(),
                title="",
                description="",
                projectLead="",
                projectType="",
                contributors=[],
                creationDate= Date.now(),
                modificationDate=""){
        
        this._id = _id;                    
        this.title = title;
        this.description=description;
        this.projectLead = projectLead;
        this.contributors=contributors;
        this.projectType=projectType;
        this.creationDate=creationDate;
        this.modificationDate=modificationDate;
    }

    getProjectDetails(){
        let projectDetails={
            _id : this._id,
            title:this.title,
            description:this.description,
            projectLead:this.projectLead,
            projectType:this.projectType,
            contributors:this.contributors,
            creationDate:this.creationDate,
            modificationDate:this.modificationDate
        } 
        return {...projectDetails};
    }

    setProjectDetails(_id = this._id,
                      title=this.title,
                      description=this.description,
                      projectLead=this.projectLead,
                      contributors=this.contributors,
                      projectType=this.projectType,
                      creationDate=this.creationDate,
                      modificationDate=this.modificationDate){

        this._id = _id;                
        this.title = title;
        this.description=description;
        this.projectLead = projectLead;
        this.conbtributors=contributors;
        this.projectType=projectType;
        this.creationDate=creationDate;
        this.modificationDate=modificationDate;
    }
}

//export the module
module.exports = project;