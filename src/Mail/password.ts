import { sendEmail } from '@Config/mailer.js';


export const sendLogPasswordEmail = (password: string, to: string) => {
    sendEmail(to ,`Password for Log on ${new Date().toUTCString()}`, `<h1>New password: ${password}</h1>`);
}

export const sendSuperAdminPasswordEmail = (password: string, to: string) => {
    sendEmail(to ,`Password for superAdmin on ${new Date().toUTCString()}`, `<h1>New password: ${password}</h1>`);
}