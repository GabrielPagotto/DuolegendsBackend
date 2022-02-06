import jsonwebtoken, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/http.exception";
import errorMiddleware from "./error.middleware";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        
        if (!authorization) {
            throw new  UnauthorizedException("No token provided");
        }

        const tokenSections = authorization!.split(" ");

        if (tokenSections[0] !== "Bearer") {
            throw new  UnauthorizedException("Token prefix is invalid");
        }

        const token: string = tokenSections[1];
        const secret = process.env.SECRET;

        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        if (!secret) {
            throw new Error("The secret key not informed in the environment variables. [SECRET]");
        }
        
        try {
            const decoded = jsonwebtoken.verify(token, secret);
            const { userId } = decoded;
            req.params.userId = userId;
            next();
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new UnauthorizedException("The token has expired");
            }
            
            if (err instanceof JsonWebTokenError) {
                if (err.message === 'invalid signature') {
                    throw new UnauthorizedException();
                }
            } 
            
            throw err;            
        }
    } catch (err) {
        if (err instanceof UnauthorizedException) {
            return errorMiddleware(err, req, res, next);
        } 

        throw err;    
    }
}

export default authMiddleware;
