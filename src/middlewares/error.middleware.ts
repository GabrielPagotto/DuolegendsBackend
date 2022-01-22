import { NextFunction, Request, Response } from "express";
import { NotAcceptable, NotFoundException, UnauthorizedException, ValidationException } from "../exceptions/http.exception";
 
function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): Response | void {
  const arrayOfAcceptedTypes = [
    ValidationException,
    NotFoundException,
    UnauthorizedException,
    NotAcceptable,
  ];
  let type, status, message = "An unexpected error happened";
  arrayOfAcceptedTypes.forEach((errorType) => {
    if (error instanceof errorType) {
      type = error.type;
      status = error.status;
      message = error.message;
    }
  });
  if (type && status && message) {
    return res.status(status).json({ status, type, message });
  }
  return next(error);
}
 
export default errorMiddleware;
