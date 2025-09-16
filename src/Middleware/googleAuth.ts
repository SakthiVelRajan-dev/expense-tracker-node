import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL ?? ''}/auth/google/callback`,
    clientID: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    state: true
}, (_accessToken, _refreshToken, profile, done) => {
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, (user as Profile).id);
})

passport.deserializeUser((user, done) => {
    (() => {
        const actualUser = user as Express.User;
        done(null, actualUser);
    })();
})

export default passport;