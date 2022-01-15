import { NextFunction, Request, Response } from 'express';
import { ValidationException } from '../exceptions/http.exception';
 
function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): Response | void {
  if (error instanceof ValidationException) {
    const status = error.status;
    const message = error.message ?? 'An unexpected error happened';

    return res.status(status).json({ status, message });
  } else {
    return next(error);
  }
}
 
export default errorMiddleware;
