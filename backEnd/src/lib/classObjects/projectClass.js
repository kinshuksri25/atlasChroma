//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for project objects
class project{

    constructor({_id = randValueGenerator(),
                title="",
                description="",
                projectlead="",
                projecttype="",
                contributors=[],
                creationdate= Date.now(),
                modificationdate=""}){
        
        this._id = _id;                    
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.contributors=contributors;
        this.projecttype=projecttype;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
    }

    getProjectDetails(){
        let projectDetails={
            _id : this._id,
            title:this.title,
            description:this.description,
            projectlead:this.projectlead,
            projecttype:this.projecttype,
            contributors:this.contributors,
            creationdate:this.creationdate,
            modificationdate:this.modificationdate
        } 
        return {...projectDetails};
    }

    setProjectDetails({_id = this._id,
                      title=this.title,
                      description=this.description,
                      projectlead=this.projectlead,
                      contributors=this.contributors,
                      projecttype=this.projecttype,
                      creationdate=this.creationdate,
                      modificationdate=this.modificationdate}){

        this._id = _id;                
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.conbtributors=contributors;
        this.projecttype=projecttype;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
    }
}

//export the module
module.exports = project;
