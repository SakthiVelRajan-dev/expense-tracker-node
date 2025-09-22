import { UserType } from './common.js';

export interface AuthRequest {
    email: string;
    password: string;
    role?: UserType;
}