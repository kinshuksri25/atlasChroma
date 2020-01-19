//email module 

//Dependencies
const nodemailer = require("nodemailer");
const {refreshAccessToken} = require('./auth');

//declaring the module
const email = {};

email.sendEmail = (senderEmail,recieverEmail,refreshToken,clientID,clientSecret,subject,data) => new Promise((resolve,reject) => {
    
    refreshAccessToken(refreshToken).then(senderAccessTokenObject => {
            const smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: senderEmail,
                    clientId: clientID,
                    clientSecret: clientSecret,
                    refreshToken: refreshToken,
                    accessToken: senderAccessTokenObject.access_token
            }});
        
            const mailOptions = {
                from: senderEmail,
                to: recieverEmail,
                subject: subject,
                generateTextFromHTML: true,
                html: data
            };
        
            smtpTransport.sendMail(mailOptions, (error, response) => {
            if(error){
                reject(error);
            }else{
                resolve(true);
            }    
            smtpTransport.close();
        });
    }).catch(error => {
        //TODO -->add error code
        //unable to send email
        reject(error);
    });
});

//exporting the module
module.exports = {...email};