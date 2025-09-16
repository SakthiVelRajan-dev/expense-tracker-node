import express from 'express';
import passport from '../Middleware/googleAuth.js';
import User from '../Schema/User.js';
import { generateToken } from '../utils/generateToken.js';

const googleAuthRouter = express.Router();

googleAuthRouter.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

googleAuthRouter.get('/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), async (_req, res) => {
    const isUserExist = await User.findOne({
        email: (_req.user)?._json?.email,
        type: 'oAuth'
    }).exec();
    if (!isUserExist) {
        const user = new User({
            email: _req.user?._json?.email,
            name: _req.user?._json?.name,
            type: 'oAuth',
            password: ''
        });
        await user.save();
    }
    const token =  generateToken({
        email: _req.user?._json?.email
    });
    res.redirect(`${process.env.FRONT_END_URL}/?token=${token}`);
})

export default googleAuthRouter;