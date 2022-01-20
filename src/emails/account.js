const mailgun = require("mailgun-js");

const DOMAIN = 'sandbox27c0980719d847c4b1583730f156cde0.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

const sendWelcomeEmail = (emailAddress, userName) => {
    mg.messages().send({
        from: 'Narasimha Kamath <narasimha1994@gmail.com>',
        to: emailAddress,
        subject: 'Welcome to the Task application',
        text: 'Welcome! This is generated using mailGun using NodeJS.'
    }, (error, body) => {
        console.log(body);
    });
}

module.exports = {
    sendWelcomeEmail
}