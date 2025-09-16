import express from 'express';
import googleAuthRouter from './GoogleAuthenticate.js';
import emailPasswordRouter from './EmailPasswordAuthenticate.js';

const authenticateRouter = express.Router();

authenticateRouter.use('/google', googleAuthRouter);

authenticateRouter.use('/email', emailPasswordRouter);

authenticateRouter.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({
        message: 'User logged out successfully'
    })
  });
});

export default authenticateRouter;