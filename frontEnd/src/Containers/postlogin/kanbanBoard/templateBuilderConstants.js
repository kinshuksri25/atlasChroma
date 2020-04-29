var templateBuilderConstants = {};
//sample structure -->
// {
//     Name : "",  ---> this is the parent structure
//     WIP : false,
//     CHILDREN : [] 
// },
// {
//     Name : "",   ---> this would be the subphase structure
//     WIP : false,
//     EXTENDS : ""    
// }
templateBuilderConstants.SIMPLE = [
    {
        _id:"",
        NAME:"TODO",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"WORK IN PROGRESS",
        WIP: true,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"DONE",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    }
];

templateBuilderConstants.SDLC = [

    {
        _id:"",
        NAME:"BACKLOG",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"TODO",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"WORK IN PROGRESS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : ["DESIGN","DEVELOPMENT","TESTING"]
    },
    {
        _id:"",
        NAME:"DESIGN",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"DEVELOPMENT",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"TESTING",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"DEPLOYMENT",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"BLOCKERS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
];
 
templateBuilderConstants.MANUFACTURING = [    
    
    {
        _id:"",
        NAME:"BACKLOG",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"DESIGN",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"ANALYSIS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"MANUFACTURING",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"QUALITY ASSURANCE",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        _id:"",
        NAME:"DELIVERY",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    }

];

templateBuilderConstants.CUSTOM = [];

//export the module
export default templateBuilderConstants;