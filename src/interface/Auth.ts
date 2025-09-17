export interface AuthRequest {
    email: string;
    password: string;
    role?: 'log_user' | 'user'
}