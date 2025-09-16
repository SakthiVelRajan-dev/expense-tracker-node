// In src/types/express/index.d.ts

import { Profile } from 'passport-google-oauth20';

// This declaration merging will add the properties from the Google Profile
// to the Express.User type, so you can access them on req.user
declare global {
  namespace Express {
    export interface User extends Profile {}
  }
}