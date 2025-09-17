export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  role: 'log_user' | 'super_admin' | 'user';
  type: 'email-password' | 'oAuth';
}