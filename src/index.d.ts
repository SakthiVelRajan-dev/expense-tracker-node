// In src/types/express/index.d.ts

import { IUser } from '@interface/schema.ts';
import 'express-session';
import { Profile } from 'passport-google-oauth20';

// This declaration merging will add the properties from the Google Profile
// to the Express.User type, so you can access them on req.user
declare global {
  namespace Express {
    export type User = Profile
  }
}

declare module 'express-session' {
  interface SessionData {
    // Define your custom properties here
    tokenDetail: {
      email: string;
      id: string;
      is_email_verified: boolean;
      role: IUser['role'];
    };
  }
}