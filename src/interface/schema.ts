export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  type: 'email-password' | 'oAuth';
}