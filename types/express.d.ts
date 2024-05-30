// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: number;
    }

    interface Request {
      user: User;
    }
  }

  interface BigInt {
    toJSON(): any;
  }
}
