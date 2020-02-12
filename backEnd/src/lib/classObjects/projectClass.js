//Blueprint for project objects

export default class project{

    constructor(title="",
                description="",
                startDate="",
                projectLead="",
                projectType="",
                contributors="",
                creationDate="",
                modificationDate=""){

        this.title = title;
        this.description=description;
        this.startDate=startDate;
        this.projectLead = projectLead;
        this.conbtributors=contributors;
        this.projectType=projectType;
        this.creationDate=creationDate;
        this.modificationDate=modificationDate;
    }

    getProjectDetails(){
        let projectDetails={
            title:this.title,
            description:this.description,
            startDate:this.startDate,
            projectLead:this.projectLead,
            projectType:this.projectType,
            contributors:this.contributors,
            creationDate:this.creationDate,
            modificationDate:this.modificationDate
        } 
        return projectDetails;
    }

    setProjectDetails(title=this.title,
                      description=this.description,
                      startDate=this.startDate,
                      projectLead=this.projectLead,
                      contributors=this.contributors,
                      projectType=this.projectType,
                      creationDate=this.creationDate,
                      modificationDate=this.modificationDate){

        this.title = title;
        this.description=description;
        this.startDate=startDate;
        this.projectLead = projectLead;
        this.conbtributors=contributors;
        this.projectType=projectType;
        this.creationDate=creationDate;
        this.modificationDate=modificationDate;
    }
}