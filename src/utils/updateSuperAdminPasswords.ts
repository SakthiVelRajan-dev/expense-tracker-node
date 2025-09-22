import { addLogger } from '@Config/logger.js';
import { sendSuperAdminPasswordEmail } from '@Mail/password.js';
import User from '@Schema/User.js';

import { generateRandomPassword } from './generatePassword.js';

export const updateSuperAdminPasswords = async () => {
    const randomPassword = generateRandomPassword();
    const emailUsers = (process.env.SUPER_ADMIN_USER?.split(',') ?? []).map(item => item.trim());
    const users = await User.find({
        email: {$in: emailUsers},
        role: 'super_admin'
    });
    addLogger('info', 'app', 'users List', users);
    users.forEach((val) => {
        void (async () => {
            val.password = randomPassword
            await val.save();
            sendSuperAdminPasswordEmail(randomPassword);
        })();
    })
}
