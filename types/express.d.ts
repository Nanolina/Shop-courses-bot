// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
      firstName: string;
      lastName?: string;
      username?: string;
    }

    interface Request {
      user: User;
    }
  }

  interface BigInt {
    toJSON(): any;
  }
}
