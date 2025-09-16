import express from 'express';

import emailPasswordRouter from './EmailPasswordAuthenticate.js';
import googleAuthRouter from './GoogleAuthenticate.js';

const authenticateRouter = express.Router();

authenticateRouter.use('/google', googleAuthRouter);

authenticateRouter.use('/email', emailPasswordRouter);

authenticateRouter.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { next(err); return; }
    res.status(200).json({
        message: 'User logged out successfully'
    })
  });
});

export default authenticateRouter;