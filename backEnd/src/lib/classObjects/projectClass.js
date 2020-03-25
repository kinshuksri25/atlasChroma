//Dependencies
const {randValueGenerator} = require("../utils/helper");

//Blueprint for project objects
class project{

    constructor({_id = randValueGenerator(),
                title="",
                description="",
                projectlead="",
                contributors=[], 
                creationdate= Date.now(),
                modificationdate="",
                boarddetails = {},
                storydetails = []}){
        
        this._id = _id;                    
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.contributors=contributors;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
        this.boarddetails = boarddetails;
        this.storydetails = storydetails;
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
            boarddetails:this.boarddetails,
            storydetails:this.storydetails
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
                      boarddetails=this.boarddetails,
                      storydetails=this.storydetails}){

        this._id = _id;                
        this.title = title;
        this.description=description;
        this.projectlead = projectlead;
        this.conbtributors=contributors;
        this.creationdate=creationdate;
        this.modificationdate=modificationdate;
        this.boarddetails=boarddetails;
        this.storydetails=storydetails;
    }
}

//export the module
module.exports = project;
