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
        route: '/postSignupForm',
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
        className: "signUpAttributes"
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
        type: "textbox",
        width: "100px",
        height: "50px",
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

//export the module
export default formConstants;
