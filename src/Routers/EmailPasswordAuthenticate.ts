import express from 'express';
import User from '../Schema/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

const emailPasswordRouter = express.Router();

emailPasswordRouter.post('/login', async (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;
    console.log(email, 'email', password);
    if (!email || !password) {
        return res.status(401).send('Invalid request');
    }
    const user = await User.findOne({
        email,
        type: 'email-password'
    }).exec();
    if (!user) {
        return res.status(401).json({
            message: 'User not found'
        });
    }
    const isValidPassword = bcrypt.compare(password, user.password!);
    if(!isValidPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }
    const token = generateToken({
        email: user.email
    });
    res.status(200).json({
        message: 'User Login Successful',
        data: {
            token
        }
    })
});

emailPasswordRouter.post('/sign-up', async (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;
    if (!email || !password) {
        return res.status(401).send('Invalid request');
    }
    const user = await User.findOne({
        email,
        type: 'email-password'
    }).exec();
    if (user) {
        return res.status(401).json({
            message: 'User already exists'
        });
    }
    const newUser = await User.insertOne({
        email,
        password,
        type: 'email-password'
    });
    if(newUser) {
        res.status(201).json({
            message: 'User Created Succesfully'
        })
    } else {
        res.status(500).send('Internal server error')
    }
});

export default emailPasswordRouter;