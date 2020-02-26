//Blueprint for project objects

//TODO add a _id value and a default value for it using random generator
class project{

    constructor(
                title="",
                description="",
                projectLead="",
                projectType="",
                contributors=[],
                creationDate= Date.now(),
                modificationDate=""){

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

    setProjectDetails(title=this.title,
                      description=this.description,
                      projectLead=this.projectLead,
                      contributors=this.contributors,
                      projectType=this.projectType,
                      creationDate=this.creationDate,
                      modificationDate=this.modificationDate){

        this.title = title;
        this.description=description;
        this.projectLead = projectLead;
        this.conbtributors=contributors;
        this.projectType=projectType;
        this.creationDate=creationDate;
        this.modificationDate=modificationDate;
    }
}

module.exports = project;