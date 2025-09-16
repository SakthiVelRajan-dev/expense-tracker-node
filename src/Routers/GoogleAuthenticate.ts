/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    const isUserExist = await User.findOne({
        email: req_user._json.email,
        type: 'oAuth'
    }).exec();
    if (!isUserExist) {
        const user = new User({
            email: req_user._json.email,
            name: req_user._json.name,
            password: '',
            type: 'oAuth'
        });
        await user.save();
    }
    const token:string =  generateToken({
        email: req_user._json.email
    });
    res.redirect(`${process.env.FRONT_END_URL ?? ''}/?token=${token}`);
})

export default googleAuthRouter;