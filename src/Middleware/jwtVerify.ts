import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';

export const jwtVerify =(req:Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization') ?? '';
        if (!token) {
            return res.status(401).send('Unauthoized');
        }
        // jwt secret key
        const isValidToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET ?? '');
        if (!isValidToken) {
            return res.status(403).send('Invalid Bearer Token');
        }
        next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
        return res.status(403).send('Invalid Bearer Token');
    }
}