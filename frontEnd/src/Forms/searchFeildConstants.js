const searchFeildConstants = {};

searchFeildConstants.addProject = [
   {
      name: "Project Lead",
      placeholder: "Project Lead",
      id: "projectLead",
      className: "searchBox",
      type : 0,
      stateValueName: "projectLeadName",
      searchCriteria: ["email","username"] 
   },
   {
      name: "Contributors",
      placeholder: "Contributors",
      id: "contributors",
      className: "searchBox",
      type : 1,
      stateValueName: "contributorList",
      searchCriteria: ["email","username"] 
   }
];

searchFeildConstants.addParticipants = [{
   name: "Participants",
   placeholder: "Add Participants",
   id: "participants",
   className: "searchBox",
   type : 1,
   stateValueName: "participantsList",
   searchCriteria: ["email","username"] 
}];
                                   
//export the module
export default searchFeildConstants;                                                             