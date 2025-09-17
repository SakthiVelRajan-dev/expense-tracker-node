import 'dotenv/config';
import { connectDb } from '@Config/db.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import authenticateRouter from '@Router/Authenticate.js';
import logRouter from '@Router/LogRoutes.js';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import fs from 'fs-extra';
import passport from 'passport';
import path from 'path';

const app = express();

await connectDb();

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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT ?? ''}`)
});