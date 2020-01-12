var formConstants = {};

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
        route: '/googleLogin',
        id: "googleLoginButton",
        className: "loginAttributes"
    }

];

//export the module
export default formConstants;