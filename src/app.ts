import 'dotenv/config';
import { connectDb } from '@Config/db.js';
import { passwordUpdateCron } from '@crons/PasswordUpdateCron.js';
import { sendLogPasswordEmail } from '@Mail/password.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import authenticateRouter from '@Router/Authenticate.js';
import cronRouter from '@Router/CronRoutes.js';
import logRouter from '@Router/LogRoutes.js';
import User from '@Schema/User.js';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import fs from 'fs-extra';
import passport from 'passport';
import path from 'path';

const app = express();

await connectDb();

 
passwordUpdateCron();

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

app.use('/log', logRouter);

app.get('/clear-logs',async (_req, res) => {
     const logsDirPath = path.join(process.cwd(), 'src', 'logs');
     
     
    await fs.emptyDir(logsDirPath);

    res.status(200).json({
        message: 'Logs deleted successfully'
    })
});

app.get('/send-log-email', jwtVerify, async (_req, res) => {
    const tokenDetail = _req.session.tokenDetail;
    const user = await User.findOne({
        email: tokenDetail?.email,
        role: 'log_user',
        type: 'email-password'
    }).exec();
    if (user) {
         
        sendLogPasswordEmail(user.password ?? '');
        res.status(200).json({
            message: 'Log password sent successfully'
        })
    } else {
        res.status(403).send('Access denied');
    }
});

app.use('/cron', cronRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT ?? ''}`)
});