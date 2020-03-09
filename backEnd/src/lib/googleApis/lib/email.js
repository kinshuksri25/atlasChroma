/*
* Module for sending emails
*/

//Dependencies
const nodemailer = require("nodemailer");

//declaring the module
const email = {};


//function for sending emails
//params --> senderEmail - string, recieverEmail - string, refreshToken - string, clientID - string, clientSecret - string, subject - string, data - string, senderAccessToken - string
//returns --> promise - boolean
email.sendEmail = (senderEmail,recieverEmail,refreshToken,clientID,clientSecret,subject,data,senderAccessTokenObject) => new Promise((resolve,reject) => {
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
                console.log(error)
                reject(false);
            }else{
                resolve(true);
            }    
            smtpTransport.close();
        });
});

//exporting the module
module.exports = {...email};
