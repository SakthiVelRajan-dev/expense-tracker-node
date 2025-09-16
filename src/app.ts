import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import { connectDb } from './Config/db.js';
import authenticateRouter from './Routers/Authenticate.js';
import { jwtVerify } from './Middleware/jwtVerify.js';

const app = express();

await connectDb();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true

}));

app.use(session({
    //session secret
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
})