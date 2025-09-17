import { addLogger } from '@Config/logger.js';
import cron from 'node-cron';

export const passwordUpdateCron = () => {
    cron.schedule('*/10 * * * *', () => {
        console.log('Running a task every 10 minutes');
        addLogger('info', 'app', 'Scheduler is running', {
            date: new Date()
        })
        // Add your task logic here
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