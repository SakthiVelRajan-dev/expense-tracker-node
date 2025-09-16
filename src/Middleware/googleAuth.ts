import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, User as UserType } from '../interface/global.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}/auth/google/callback`,
    state: true
}, (_accessToken, _refreshToken, profile, done) => {
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, (user as UserType).id);
})

passport.deserializeUser(async (user, done) => {
    const actualUser = user as Express.User;
    done(null, actualUser);
})

export default passport;