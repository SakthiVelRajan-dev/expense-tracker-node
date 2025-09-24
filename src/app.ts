import 'dotenv/config';
import { connectDb } from '@Config/db.js';
import { clearExpiredOTPCron } from '@crons/ClearExpiredOTPCron.js';
import { passwordUpdateCron } from '@crons/PasswordUpdateCron.js';
import { isLogUser } from '@Middleware/isLogUser.js';
import { isSuperAdminUser } from '@Middleware/isSuperAdminUser.js';
// import { sendLogPasswordEmail } from '@Mail/password.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import authenticateRouter from '@Router/Authenticate.js';
import cronRouter from '@Router/CronRoutes.js';
import expenseTypeRouter from '@Router/ExpenseTypesRoutes.js';
import logRouter from '@Router/LogRoutes.js';
// import User from '@Schema/User.js';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import fs from 'fs-extra';
import passport from 'passport';
import path from 'path';

const app = express();

await connectDb();

passwordUpdateCron();
clearExpiredOTPCron();

const appRateLimit = rateLimit({
    handler: (req,res, next, option) => {
        res.status(option.statusCode).json({
            message: option.message as string
        })
    },
    limit: 100,
    standardHeaders: true,
    validate: {
        xForwardedForHeader: false
    },
    windowMs: 10 * 60 * 1000 // handle 100 request for 10 minutes
});

app.use(appRateLimit);

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: process.env.FRONT_END_URL
}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    //session secret
    secret: process.env.SESSION_SECRET ?? '',
}))

// config for oauth 
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({
    extended: true
}));
 
app.use('/auth', authenticateRouter);

app.get('/',jwtVerify, (_req, res) => {
    res.status(200).json({
        message: 'You are in dashboard page'
    })
});

app.use('/log', jwtVerify, isLogUser, logRouter);
app.use('/cron', jwtVerify, isSuperAdminUser,  cronRouter);

app.get('/clear-logs', jwtVerify, isLogUser, async (_req, res) => {
     const logsDirPath = path.join(process.cwd(), 'src', 'logs');
     
     
    await fs.emptyDir(logsDirPath);

    res.status(200).json({
        message: 'Logs deleted successfully'
    })
});

// app.get('/send-log-email', jwtVerify, async (_req, res) => {
//     const tokenDetail = _req.session.tokenDetail;
//     const user = await User.findOne({
//         email: tokenDetail?.email,
//         role: 'log_user',
//         type: 'email-password'
//     }).exec();
//     if (user) {
         
//         sendLogPasswordEmail(user.password ?? '');
//         res.status(200).json({
//             message: 'Log password sent successfully'
//         })
//     } else {
//         res.status(403).send('Access denied');
//     }
// });

app.use('/expense-types', jwtVerify, expenseTypeRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT ?? ''}`)
});