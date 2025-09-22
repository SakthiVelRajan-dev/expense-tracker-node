import { Messages } from '@Constants/message.js';
import { IUser } from '@interface/schema.js';
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';

export const jwtVerify = (req:Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization') ?? '';
        if (!token) {
            return res.status(401).json({
                message: Messages.UNAUTHORIZED
            });
        }
        // jwt secret key
        const isValidToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET ?? '');
        if (!isValidToken) {
            return res.status(401).json({
                message: Messages.INVALID_BEARER_TOKEN
            });
        }
        const tokenDetail = jwt.decode(token.replace('Bearer ', '')) as {
            email: string,
            id: string;
            role:IUser['role'];
        };
        req.session.tokenDetail = tokenDetail;
        req.session.save()
        next();
    } catch (_err) {
        console.log(_err);
        return res.status(401).json({
                message: Messages.INVALID_BEARER_TOKEN
            });
    }
}