import { addLogger } from '@Config/logger.js';
import transporter from '@Config/mailer.js';


export const sendLogPasswordEmail = (password: string, to: string) => {
     
    transporter.sendMail({
        from: process.env.MAIL_USER,
        html: `<h1>Test password: ${password}</h1>`,
        subject: `Password for Log on ${new Date().toUTCString()}`,
        to
    }, (err, info) => {
        if (err) {
            addLogger('error', 'error', 'Fail to send an Log password email', err);
        } else {
            addLogger('info', 'app', 'Log Password Email sent', info);
        }
    })
}

export const sendSuperAdminPasswordEmail = (password: string, to: string) => {
     
    transporter.sendMail({
        from: process.env.MAIL_USER,
        html: `<h1>Test password: ${password}</h1>`,
        subject: `Password for superAdmin on ${new Date().toUTCString()}`,
        to
    }, (err, info) => {
        if (err) {
            addLogger('error', 'error', 'Fail to send an Log password email', err);
        } else {
            addLogger('info', 'app', 'Log Password Email sent', info);
        }
    })
}