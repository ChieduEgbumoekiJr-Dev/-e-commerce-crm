import { Application, NextFunction, Request, Response } from 'express';
import BaseError from '../exceptions/BaseError';

export default class ErrorHandler {
  app: Application;

  constructor(app?: Application) {
    if (app) {
      this.app = app;
      this.configureErrorHandler();
    }
  }

  configureErrorHandler() {
    this.app.use(
      async (
        err: Error | BaseError,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err instanceof BaseError) {
          return res.status(err.httpCode).send(err.message);
        }
        next(err);
      }
    );
  }

  public async handleError(err: Error): Promise<void> {
    console.log(
      'Error message from the centralized error-handling component:',
      err
    );
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
