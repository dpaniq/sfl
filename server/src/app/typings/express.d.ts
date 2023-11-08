import {User} from '../db';

declare global {
  namespace Express {
    // eslint-disable-next-line
    export interface Request {
      user?: Partial<User>; // Define your custom property
      cookies?: {};
    }
  }
}
