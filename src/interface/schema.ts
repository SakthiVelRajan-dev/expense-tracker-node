export interface IUser extends Document {
  name?: string;
  email: string;
  type: 'oAuth' | 'email-password';
  password?: string;
}