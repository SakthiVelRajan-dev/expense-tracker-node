import jwt from 'jsonwebtoken';

export const generateToken =(payload:Buffer | object | string) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET ?? '', {
        expiresIn: '2h'
    });
    return token;
}