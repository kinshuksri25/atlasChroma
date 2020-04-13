var editableConstants = {};
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
editableConstants.SIMPLE = [
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

editableConstants.SDLC = [

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
 
editableConstants.MANUFACTURING = [    
    
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

editableConstants.CUSTOM = [];

editableConstants.MOUSEOVEREVENTS = [
    {
        NAME : "EDIT",
        CALLABLEFUNCTION : "",
        IMAGEURL : "EDIT"
    },
    {
        NAME : "INFO",
        CALLABLEFUNCTION : "",
        IMAGEURL : "INFO"
    },
    {
        NAME : "REMOVE",
        CALLABLEFUNCTION : "",
        IMAGEURL : "REMOVE"
    }
];

//export the module
export default editableConstants;