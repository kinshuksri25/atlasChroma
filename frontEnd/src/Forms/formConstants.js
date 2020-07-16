var formConstants = {};

formConstants.postAuthForm = [

    {
        id: "postAuthForm",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "UserName",
        type: "text",
        placeholder: "UserName",
        id: "postAuthUsername",
        className: "postAuthAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Phone",
        type: "number",
        placeholder: "Phone",
        id: "postAuthPhone",
        className: "postAuthAttributes",
        isHidden: false,
        isRequired: false
    }, 
    {
        name: "Password",
        type: "password",
        placeholder: "*********",
        id: "postAuthPassword",
        className: "postAuthAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "ConfirmPassword",
        type: "password",
        placeholder: "*********",
        id: "postAuthConfirmPassword",
        className: "postAuthAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Continue",
        type: "button",
        route: '/googleAuth/postAuthDetails',
        id: "postAuthButton",
        className: "postAuthAttributes"
    }

];

formConstants.postSignup = [

    {
        id: "postSignup",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "FirstName",
        type: "text",
        placeholder: "FirstName",
        id: "postSignupFirstName",
        className: "postSignupAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "LastName",
        type: "text",
        placeholder: "LastName",
        id: "postSignupLastname",
        className: "postSignupAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Phone",
        type: "number",
        placeholder: "Phone",
        id: "postSignupPhone",
        className: "postSignupAttributes",
        isHidden: false,
        isRequired: false
    },
    {
        name: "Continue",
        type: "button",
        route: '/signup/postSignupDetails',
        id: "postSignupButton",
        className: "postSignupAttributes"
    }

];

formConstants.signup = [

    {
        id: "signUpForm",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "UserName",
        type: "text",
        placeholder: "UserName",
        id: "signUpUsername",
        className: "signUpAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Email",
        type: "email",
        placeholder: "Email",
        id: "signUpEmail",
        className: "signUpAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Password",
        type: "password",
        placeholder: "*********",
        id: "signUpPassword",
        className: "signUpAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "ConfirmPassword",
        type: "password",
        placeholder: "*********",
        id: "signUpConfirmPassword",
        className: "signUpAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "SignUp",
        type: "button",
        route: '/signup',
        id: "signUpButton",
        className: "signUpButton"
    }

];

formConstants.login = [

    {
        id: "loginForm",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "Email",
        type: "email",
        placeholder: "Email",
        id: "loginEmail",
        className: "loginAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Password",
        type: "password",
        placeholder: "*********",
        id: "loginPassword",
        className: "loginAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Login",
        type: "button",
        route: '/login',
        id: "loginButton",
        className: "loginAttributes"
    }

];
formConstants.googleLogin = [{
        id: "loginForm",
        type: "form",
        method: "GET",
        enctype: "application/x-www-form-urlencoded"
    }, {
        name: "Email",
        type: "email",
        placeholder: "Email",
        id: "loginEmail",
        className: "loginAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Login",
        type: "button",
        route: '/googleAuth',
        id: "googleLoginButton",
        className: "loginAttributes"
    }

];

formConstants.addProject = [
    {
        id: "addProject",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "Title",
        type: "text",
        placeholder: "Title",
        id: "addProjectTitle",
        className: "addProjectAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Description",
        type: "textarea",
        rows: "4",
        cols: "50",
        placeholder: "Description",
        id: "addProjectDescription",
        className: "addProjectAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Add Project",
        type: "button",
        route: '/project',
        id: "addProjectButton",
        className: "addProjectAttributes"
    }
];

formConstants.boardTemplateSelector = [
    {
        id: "templateSelector",
        type: "form",
        method: "GET",
        enctype: "application/x-www-form-urlencoded"
    },
    {
        name: "TemplateType",
        type: "DropDown",
        placeholder: "TemplateType",
        id: "templateType",
        className: "templateAttributes",
        isHidden: false,
        isRequired: "required"
    },
    {
        name: "Next",
        type: "button",
        route: '',
        id: "templateNextButton",
        className: "templateAttributes"
    }
];

formConstants.storyForm = [
    {
        id: "addStory",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded" 
    },
    {
        name: "StoryTitle",
        type: "text",
        placeholder: "Story Title",
        id: "addStoryTitle",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Description",
        type: "textarea",
        rows: "4",
        cols: "50",
        placeholder: "Description",
        id: "addStoryDescription",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Contributor",
        type: "DropDown",
        placeholder: "Contributor",
        id: "contributor",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: "required"
    },
    {
        name: "Priority",
        type: "DropDown",
        placeholder: "Priority",
        id: "priority",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: "required"
    },
    {
        name: "EndDate",
        type: "Date",
        placeholder: "End Date",
        id: "endDate",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: "required"
    },
    {
        name: "Comments",
        type: "textarea",
        rows: "4",
        cols: "50",
        placeholder: "Comments",
        id: "addStoryComments",
        className: "addStoryAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "ADD",
        type: "button",
        route: '/stories',
        id: "templateNextButton",
        className: "templateAttributes"
    }
    
];

formConstants.addEvent = [
    {
        id: "addEvent",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded" 
    },
    {
        name: "EventTitle",
        type: "text",
        placeholder: "Event Title",
        id: "addEventTitle",
        className: "addEventAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Description",
        type: "textarea",
        rows: "4",
        cols: "50",
        placeholder: "Description",
        id: "addEventDescription",
        className: "addEventAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "ADD",
        type: "button",
        route: '/event',
        id: "templateNextButton",
        className: "addEventAttributes"
    }
];

formConstants.addNotes = [
    {
        id: "addNotes",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded" 
    },
    {
        name: "NotesTitle",
        type: "text",
        placeholder: "Notes Title",
        id: "addNotesTitle",
        className: "addNotesAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Description",
        type: "textarea",
        rows: "4",
        cols: "50",
        placeholder: "Description",
        id: "addNotesDescription",
        className: "addNotesAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "ADD",
        type: "button",
        route: '/notes',
        id: "addNotesButton",
        className: "addNotesAttributes"
    }
];

formConstants.chat = [
    {
        id: "chat",
        type: "form",
        method: "POST",
        enctype: "application/x-www-form-urlencoded" 
    },
    {
        name: "Message",
        type: "text",
        placeholder: "Message",
        id: "message",
        className: "chatAttributes",
        isHidden: false,
        isRequired: true
    },
    {
        name: "Send",
        type: "button",
        route: '',
        id: "sendMessage",
        className: "chatAttributes"
    }
];

//export the module
export default formConstants;
