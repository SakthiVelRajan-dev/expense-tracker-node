import { Messages } from '@Constants/message.js';
import { NextFunction, Request, Response } from 'express';

export const isUser = (req: Request, res: Response, next: NextFunction) => {
    const tokenDetail = req.session.tokenDetail;
    if (!tokenDetail) {
        return res.status(401).send({
            message: Messages.INVALID_REQUEST_PAYLOAD
        })
    }
    if (tokenDetail.role !== 'user') {
        return res.status(401).send({
            message: Messages.UNAUTHORIZED
        })
    };
    next();
}