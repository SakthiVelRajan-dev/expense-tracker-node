import jwt from 'jsonwebtoken';

export const generateToken =(payload:string | object | Buffer<ArrayBufferLike>) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    return token;
}