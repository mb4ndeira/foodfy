const nodemailer = require('nodemailer')

module.exports = transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "15a2a51d34f62b",
        pass: "cfe1a2d00d0068"
    }
});