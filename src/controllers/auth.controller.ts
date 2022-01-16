import { Router } from "express";
import { Controller } from "../server";

export default class AuthController extends Controller {
    public path: string = "/auth";

    public router: Router = Router();

    public initializeRoutes(): void {
        throw new Error("Method not implemented.");
    }
}
