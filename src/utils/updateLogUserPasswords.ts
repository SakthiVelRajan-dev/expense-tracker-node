import { addLogger } from '@Config/logger.js';
import { sendLogPasswordEmail } from '@Mail/password.js';
import User from '@Schema/User.js';

import { generateRandomPassword } from './generatePassword.js';

export const updateLogUsersPasswords = async () => {
    const randomPassword = generateRandomPassword();
    const emailUsers = (process.env.SUPER_ADMIN_USER?.split(',') ?? []).map(item => item.trim());
    const users = await User.find({
        email: {$in: emailUsers},
        role: 'log_user'
    });
    addLogger('info', 'app', 'users List', users);
    users.forEach((val) => {
        void (async () => {
            val.password = randomPassword
            await val.save();
            sendLogPasswordEmail(randomPassword);
        })();
    })
}
