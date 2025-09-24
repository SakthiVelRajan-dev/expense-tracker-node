/* eslint-disable @typescript-eslint/no-unsafe-argument */
 
import passport from '@Middleware/googleAuth.js';
import User from '@Schema/User.js';
import { generateToken } from '@utils/generateToken.js';
import express from 'express';
import { Profile } from 'passport-google-oauth20';

const googleAuthRouter = express.Router();

googleAuthRouter.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

googleAuthRouter.get('/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), async (req, res) => {
    const req_user = req.user as Profile;
    let response;
    const isUserExist = await User.findOne({
        email: req_user._json.email,
        type: 'oAuth'
    }).exec();
    if (!isUserExist) {
        response =await User.insertOne({
            email: req_user._json.email,
            is_email_verified: true,
            name: req_user._json.name,
            password: '',
            role: 'user',
            type: 'oAuth'
        });
    }
    const token:string =  generateToken({
        email: req_user._json.email,
        id: response?._id ?? isUserExist?._id,
        is_email_verified: true,
        role: 'user'
    });
    res.redirect(`${process.env.FRONT_END_URL ?? ''}/?token=${token}`);
})

export default googleAuthRouter;