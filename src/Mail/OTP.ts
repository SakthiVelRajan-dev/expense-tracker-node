import { sendEmail } from '@Config/mailer.js';


export const sendForgotOTPEmail = (otp: string, to: string) => {
    sendEmail(to, `Password reset OTP`, `Reset password OTP: ${otp} (valid for 10 mins).`)
};

export const sendChangePasswordEmail = (otp: string, to: string) => {
    sendEmail(to, `Change Password OTP`, `Change password OTP: ${otp} (valid for 10 mins).`)
};

export const sendVerificationEmailOTP = (otp: string, to: string) => {
    sendEmail(to, `Email verification OTP`, `Email verification OTP: ${otp} (valid for 10 mins).`)
};