 
import { createTransport } from 'nodemailer';

import { addLogger } from './logger.js';

 
const transporter = createTransport({
    auth: {
        pass: process.env.MAIL_PASSWORD,
        user: process.env.MAIL_USER
    },
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    
})

export const sendEmail = (to: string | string[], subject: string, html: string) => {
    transporter.sendMail({
            from: process.env.MAIL_USER,
            html,
            subject,
            to
        }, (_, info) => {
            // if (err) {
            //     addLogger('error', 'error', 'Fail to send an Log password email', err);
            // } else {
                addLogger('info', 'app', `Email sent for ${subject}`, info);
            // }
        })
}

export default transporter;