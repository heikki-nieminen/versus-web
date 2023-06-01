const nodemailer = require('nodemailer')
require("dotenv").config();

let config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
}

const transport = nodemailer.createTransport(config)

//Add proper error handling
const sendEmail = (email, subject, text) => {
    const mailOptions = {
        from:       process.env.EMAIL_ACCOUNT,
        to:         email,
        subject:    subject,
        text:       text
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Email sent: ", info.response)
        }
    })
}

module.exports = {sendEmail}