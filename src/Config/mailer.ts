 
import { createTransport } from 'nodemailer';

 
const transporter = createTransport({
    auth: {
        pass: process.env.MAIL_PASSWORD,
        user: process.env.MAIL_USER
    },
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    
})

export default transporter;