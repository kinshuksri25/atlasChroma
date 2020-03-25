var editableConstants = {};

editableConstants.SIMPLE = [
    {
        Name:"TODO",
        WIP: false,
        subphases:[]
    },
    {
        Name:"WORK IN PROGRESS",
        WIP: true,
        subphases:[]
    },
    {
        Name:"DONE",
        WIP: false,
        subphases:[]
    }
];

editableConstants.SDLC = [];
 
editableConstants.MANUFACTURING = [];

editableConstants.CUSTOM = [];


//export the module
export default editableConstants;