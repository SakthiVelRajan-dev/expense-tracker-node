import { addLogger } from '@Config/logger.js';
import { AuthRequest } from '@interface/Auth.js';
import User from '@Schema/User.js';
import { generateToken } from '@utils/generateToken.js';
import bcrypt from 'bcryptjs';
import express from 'express';

const emailPasswordRouter = express.Router();

emailPasswordRouter.post('/sign-up', async (req, res) => {
    const request_body = req.body as AuthRequest;
    const email = request_body.email;
    const password = request_body.password;
    const role = request_body.role;
    if (!email || !password) {
        return res.status(401).json({
            message: 'Invalid request'
        });
    }
    if (role === 'super_admin') {
        return res.status(401).json({
            message: 'Unable to create an user'
        })
    }
    const user = await User.findOne({
        email,
        type: 'email-password',
    }).exec();
    if (user) {
        return res.status(401).json({
            message: 'User already exists'
        });
    }
    await User.insertOne({
        email,
        password,
        role,
        type: 'email-password'
    });
    res.status(201).json({
        message: 'User Created Succesfully'
    })
});

emailPasswordRouter.post('/login', async (req, res) => {
    const request_body = req.body as AuthRequest;
    const email = request_body.email;
    const password:string = request_body.password;
    
    if (!email || !password) {
        return res.status(401).send('Invalid request');
    }
    addLogger('info', 'app', 'Email Password Login', [{
        email,
    }])
    const user = await User.findOne({
        email,
        type: 'email-password'
    }).exec();
    if (!user) {
        return res.status(401).json({
            message: 'User not found'
        });
    }
    let isValidPassword = false
    if (user.role === 'log_user' || user.role === 'super_admin') {
        isValidPassword = user.password === password;
    } else {
        isValidPassword = await bcrypt.compare(password, (user.password ?? ''));
    }
    if(!isValidPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }
    const token = generateToken({
        email: user.email,
        id: user._id,
        role: user.role
    });
    addLogger('error', 'error', 'Email Password Login', [{
        email,
    }])
    res.status(200).json({
        data: {
            token
        },
        message: 'User Login Successful'
    })
});

export default emailPasswordRouter;