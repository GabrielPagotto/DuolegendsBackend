import jsonwebtoken  from "jsonwebtoken";

import { Router, Request, Response } from "express";
import { NotFoundException, UnauthorizedException } from "../exceptions/http.exception";
import { User } from "../models/user.model";
import { Controller } from "../server";
import passwordUtil from "../utils/password.util";

export default class AuthController extends Controller {
    public path: string = "/auth";

    public router: Router = Router();

    public initializeRoutes(): void {
        this.router.post("/", this.authenticate);
    }

    private async authenticate(req: Request, res: Response): Promise<Response> {
        const { email, password } = await req.body;
        const user = await User.findOne({ where: { email }});
        if (user) {
            if (await passwordUtil.verifyPassword(password, user.password)) {
                const secret = process.env.SECRET;
                if (!secret) {
                    throw new Error("The secret key not informed in the environment variables. [SECRET]");
                }
                const token = jsonwebtoken.sign({ userId: user.id }, secret);
                const data = {
                    auth: true,
                    token,
                }; 
                return res.json(data);    
            } else {
                throw new UnauthorizedException('wrong-password');
            }
        } else {
            throw new NotFoundException("user-not-found");
        }
    }
}
