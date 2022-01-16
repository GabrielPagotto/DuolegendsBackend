import { Request, Response, Router } from "express";

import { User } from "../models/user.model";
import { Controller } from "../server";
import { ValidationException } from "../exceptions/http.exception";
import { generatePasswordHash } from "../utils/password.util";
import UserValidator from "../validators/user.validator";

export default class UserController extends Controller {
	public path: string = "/users";
	public router = Router();
	public initializeRoutes() {
		this.router.get("/", this.index);
		this.router.post("/", this.store);
		this.router.get("/:id", this.get);
		this.router.put("/:id", this.update);
		this.router.delete("/:id", this.delete);
	}

	private async index(req: Request, res: Response): Promise<Response> {
		const users = await User.find().skip(3).limit(3); 
		return res.json(users);
	}

	private async store(req: Request, res: Response): Promise<Response>  {
		const { body } = req;
		const user = new User(body);	
		const validator = new UserValidator(user);
		validator.validateUserForSave();
		const userExists = await User.findOne({ email: user.email });
		if (!userExists) {
			user.password = await generatePasswordHash(user.password);
			await user.save();
			return res.json(user);
		} else {
			throw new ValidationException("Email alreay exists.");
		}
	}

	private async get(req: Request, res: Response ): Promise<Response> {
		return res.json({ "method": "get" });
	}

	private async update(req: Request, res: Response ): Promise<Response> {
		return res.json({ "method": "put" });
	}

	private async delete(req: Request, res: Response ): Promise<Response> {
		return res.json({ "method": "delete" });
	}
}
