 

import { startCron, stopCron } from '@crons/PasswordUpdateCron.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import User from '@Schema/User.js';
import express from 'express';

const cronRouter = express.Router();

cronRouter.get('/start', jwtVerify, async (req, res) => {
    const tokenDetail = req.session.tokenDetail;
    if (tokenDetail?.role !== 'super_admin') {
        return res.status(403).send('Access denied');
    }
    const user = await User.findOne({
        email: tokenDetail.email,
        role: tokenDetail.role,
        type: 'email-password'
    }).exec();
    if (!user) {
        return res.status(403).send('Access denied');
    }
    await startCron();
    res.status(200).send('Crons started successfully');
});

cronRouter.get('/stop', jwtVerify, async (req, res) => {
    const tokenDetail = req.session.tokenDetail;
    if (tokenDetail?.role !== 'super_admin') {
        return res.status(403).send('Access denied');
    }
    const user = await User.findOne({
        email: tokenDetail.email,
        role: tokenDetail.role,
        type: 'email-password'
    }).exec();
    if (!user) {
        return res.status(403).send('Access denied');
    }
    await stopCron();
    res.status(200).send('Crons stopped successfully');
});

export default cronRouter;