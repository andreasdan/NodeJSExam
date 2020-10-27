const nodemailer = require('nodemailer');
const mailCredentials = require('./config/mailCredentials.js');

const transporter = nodemailer.createTransport(mailCredentials);

module.exports = {
    sendResetEmail: (email, key) => {
        transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                transporter.sendMail({
                    from: '"noreply" <' + mailCredentials.auth.user + '>',
                    to: email,
                    subject: 'Password reset request',
                    text: 'Hi,\n\nSomeone requested a password reset for this account. If this was you, follow this link:\nhttp://localhost:3000/reset/' + key
                     + '\nIf not, simply ignore this email. (NOTE: This link expires in 15 minutes)'
                }, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Sent email reset key to', email, info.messageId);
                    }
                });
            }
        });
    }
}