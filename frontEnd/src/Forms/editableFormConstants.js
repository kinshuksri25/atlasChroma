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
        NAME:"TODO",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"WORK IN PROGRESS",
        WIP: true,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"DONE",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    }
];

editableConstants.SDLC = [

    {
        NAME:"BACKLOG",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"TODO",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"WORK IN PROGRESS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : ["DESIGN","DEVELOPMENT","TESTING"]
    },
    {
        NAME:"DESIGN",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        NAME:"DEVELOPMENT",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        NAME:"TESTING",
        WIP: true,
        EXTENDS : "WORK IN PROGRESS",
        CHILDREN : []
    },
    {
        NAME:"DEPLOYMENT",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"BLOCKERS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
];
 
editableConstants.MANUFACTURING = [    
    
    {
        NAME:"BACKLOG",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"DESIGN",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"ANALYSIS",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"MANUFACTURING",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
        NAME:"QUALITY ASSURANCE",
        WIP: false,
        EXTENDS : "",
        CHILDREN : []
    },
    {
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