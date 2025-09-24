import { addLogger } from '@Config/logger.js';
import Verification from '@Schema/Verification.js';
import cron from 'node-cron';

export const clearExpiredOTPCron = () => {
    cron.schedule('* * * * *', async () => {
        try {
            await Verification.deleteMany({
                expires_at: { $lt: new Date() }
            })
        } catch (err) {
            addLogger('error', 'cron-error', 'Clear  Expired OTP cron', err);
        }
    }, {
        name: 'Clear Expired OTP Cron',
    })
}
