import { Request, Response } from "express"

import { User } from '../models/user.model';
import { validateUserToPost } from "../validators/user.validator";

export default class UserController {
	static async index(req: Request, res: Response): Promise<Response> {
		const users = await User.find(); 
		return res.json(users);
	}

	static async store(req: Request, res: Response): Promise<Response> {
		const { body } = req;
		const user = new User(body);
		const validation = validateUserToPost(user);

		if (validation != null) {
			return res.status(400).json({ message: validation })
		}

		const userExists = await User.findOne({ email: user.email });

		if (userExists) {
			return res.status(400).json({ message: "Email alreay exists." });
		}
		
		await user.save();
		return res.json(user);
	}

	static async get(req: Request, res: Response ): Promise<Response> {

		return res.json({"method": "get"});
	}

	static async update(req: Request, res: Response ): Promise<Response> {
		return res.json({"method": "put"});
	}

	static async delete(req: Request, res: Response ): Promise<Response> {
		return res.json({"method": "delete"});
	}
}
