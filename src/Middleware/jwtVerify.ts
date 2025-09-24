import { addLogger } from '@Config/logger.js';
import { Messages } from '@Constants/message.js';
import { IUser } from '@interface/schema.js';
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';

export const jwtVerify = (req:Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization') ?? '';
    try {
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
            is_email_verified: boolean;
            role:IUser['role'];
        };
        req.session.tokenDetail = tokenDetail;
        req.session.save()
        next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        const tokenDetail = jwt.decode(token.replace('Bearer ', '')) as {
            email: string,
            id: string;
            role:IUser['role'];
        }
        addLogger('error', 'app', `Invalid BearerToken ${tokenDetail.email} at the role of ${tokenDetail.role}`, null)
        return res.status(401).json({
                message: Messages.INVALID_BEARER_TOKEN
            });
    }
}