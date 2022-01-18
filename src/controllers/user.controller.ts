import { Request, Response, Router } from "express";

import { User } from "../models/user.model";
import { Controller } from "../server";
import { NotFoundException, ValidationException } from "../exceptions/http.exception";
import { generatePasswordHash } from "../utils/password.util";

export default class UserController extends Controller {
	public path: string = "/users";
	public router: Router = Router();
	public initializeRoutes() {
		this.router.get("/", this.index);
		this.router.post("/", this.store);
		this.router.get("/:id", this.get);
		this.router.put("/", this.update);
		this.router.delete("/:id", this.delete);
	}

	private async index(req: Request, res: Response): Promise<Response> {
		const users = await User.find(); 
		return res.json(users);
	}

	private async store(req: Request, res: Response): Promise<Response>  {
		const { body } = req;
		const user = new User(body);	
		if (user.email.length < 4 || !user.email.match("@")) {
            throw new ValidationException("The email provided is invalid");
        }
		if (user.password.length < 6) {
            throw new ValidationException("The password must contain at least 8 digits");
        }
		if (await User.findOne({ email: user.email })) {
			throw new ValidationException("Email alreay exists");
		} 
		user.password = await generatePasswordHash(user.password);
		await user.save();
		return res.json(user);
	}

	private async get(req: Request, res: Response ): Promise<Response> {
		const { id } = req.params;
		const user = await User.findById(id);
		if (user) {
			return res.json(user); 
		} else {
			throw new NotFoundException("User not found");
		}
	}

	private async update(req: Request, res: Response ): Promise<Response> {
		const { id, userId } = req.params;
		if (id === userId) {
			const user = await User.findOne({ _id: id });
			if (user) {
				await user.delete();
				return res.json(user);
			} else {
				throw new NotFoundException("User not found");
			}
		}  else {
			throw new ValidationException("Function can be performed only by owner");
		}
	}

	private async delete(req: Request, res: Response ): Promise<Response> {
		const { id, userId } = req.params;
		console.log(req.params);
		if (id === userId) {
			const user = await User.findOne({ _id: id });
			if (user) {
				await user.delete();
				return res.json(user);
			} else {
				throw new NotFoundException("User not found");
			}
		}  else {
			throw new ValidationException("Function can be performed only by owner");
		}
	}
}
