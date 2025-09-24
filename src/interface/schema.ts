import mongoose from 'mongoose';

import { AuthType, UserType } from './common.js';

export interface ExpenseType {
  created_by?: mongoose.Types.ObjectId;
  description?: string;
  name: string;
  role: UserType;
}

export interface ExpenseTypes extends Document, ExpenseType {};

export interface IUser extends Document {
  email: string;
  is_email_verified: boolean;
  name?: string;
  password?: string;
  role: UserType;
  type: AuthType;
}