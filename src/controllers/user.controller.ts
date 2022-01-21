import { Request, Response, Router } from "express";

import { User, UserAttribute } from "../models/user.model";
import { Controller } from "../server";
import { NotFoundException, ValidationException } from "../exceptions/http.exception";
import { generatePasswordHash } from "../utils/password.util";
import authMiddleware from "../middlewares/auth.middleware";

export default class UserController extends Controller {
	public path: string = "/users";
	public router: Router = Router();
	public authenticationRequired: boolean = false;
	public initializeRoutes() {
		this.router.get("/", authMiddleware, this.index);
		this.router.post("/", this.store);
		this.router.get("/:id", authMiddleware, this.get);
		this.router.put("/", authMiddleware, this.update);
		this.router.delete("/:id", authMiddleware, this.delete);
	}

	private async index(req: Request, res: Response): Promise<Response> {
		const users = await User.findAll();
		return res.json(users);
	}

	private async store(req: Request, res: Response): Promise<Response>  {
		const { body } = req;
		const user = body as UserAttribute;	
		if (user.email.length < 4 || !user.email.match("@")) {
			throw new ValidationException("The email provided is invalid");
		}
		if (user.password.length < 6) {
			throw new ValidationException("The password must contain at least 8 digits");
		}
		if (await User.findOne({ where: { email: user.email }})) {
			throw new ValidationException("Email alreay exists");
		} 
		user.password = await generatePasswordHash(user.password);
		const createdUser = await User.create(user);
		return res.json(createdUser);
	}

	private async get(req: Request, res: Response ): Promise<Response> {
		const { id } = req.params;
		const user = await User.findByPk(id, { include: {
			association: "leagueoflegendsAccount",
			include: [{ association: "leagueoflegendsSummoner" }],
		}});
		if (user) {
			return res.json(user); 
		} else {
			throw new NotFoundException("User not found");
		}
	}

	private async update(req: Request, res: Response ): Promise<Response> {
		const { id, userId } = req.params;
		if (id === userId) {
			const user = await User.findOne({ where: { id: id }});
			if (user) {
				await user.destroy();
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
			const user = await User.findOne({ where: { id }});
			if (user) {
				await user.destroy();
				return res.json(user);
			} else {
				throw new NotFoundException("User not found");
			}
		}  else {
			throw new ValidationException("Function can be performed only by owner");
		}
	}
}
