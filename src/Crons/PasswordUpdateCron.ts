import { addLogger } from '@Config/logger.js';
import { updateLogUsersPasswords } from '@utils/updateLogUserPasswords.js';
import { updateSuperAdminPasswords } from '@utils/updateSuperAdminPasswords.js';
import cron from 'node-cron';

export const passwordUpdateCron = () => {
    cron.schedule('0 0 * * *', async () => {
        addLogger('info', 'app', 'Password update cron started for', {
            date: new Date().toLocaleDateString()
        })
        await updateSuperAdminPasswords();
        await updateLogUsersPasswords();
        addLogger('info', 'app', 'Password update cron ended for', {
            date: new Date().toLocaleDateString()
        })
    }, {
        name: 'Password Update Cron',
    })
}

export const stopCron = async() => {
    const tasks = cron.getTasks();
    let task:cron.ScheduledTask | undefined;
    tasks.forEach((val) => {
        if (val.name === 'Password Update Cron') {
            task = val;
        }
    })
    if (task) {
        await task.stop();
    }
    return null;
}

export const startCron = async () => {
    const tasks = cron.getTasks();
    let task:cron.ScheduledTask | undefined;
    tasks.forEach((val) => {
        if (val.name === 'Password Update Cron') {
            task = val;
        }
    })
    if (task) {
        await task.start();
    }
    return null
}