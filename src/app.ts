import 'dotenv/config';
import { connectDb } from '@Config/db.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import authenticateRouter from '@Router/Authenticate.js';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
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


// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use('/auth', authenticateRouter);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.get('/',jwtVerify, (_req, res) => {
    res.status(200).json({
        message: 'You are in dashboard page'
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT ?? ''}`)
})