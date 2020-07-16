const searchFeildConstants = {};

searchFeildConstants.addProject = [
   {
   name: "Project Lead",
   placeholder: "Project Lead",
   id: "projectLead",
   className: "searchBox",
   suggestionStateName: "projectLeadSuggestionList",
   searchCriteria: ["email","username"] 
   },
   {
      name: "Contributors",
      placeholder: "Contributors",
      id: "contributors",
      className: "searchBox",
      suggestionStateName: "contributorSuggestionList",
      searchCriteria: ["email","username"] 
   }
];

searchFeildConstants.addParticipants = [{
   name: "Participants",
   placeholder: "Add Participants",
   id: "participants",
   className: "searchBox",
   suggestionStateName: "participantsSuggestionList",
   searchCriteria: ["email","username"] 
}];
                                   
//export the module
export default searchFeildConstants;                                                             