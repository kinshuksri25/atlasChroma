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
                                   
//export the module
export default searchFeildConstants;                                                             