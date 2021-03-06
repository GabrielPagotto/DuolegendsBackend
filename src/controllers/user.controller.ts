import { Request, Response, Router } from "express";

import { User } from "../models/user.model";
import { Controller } from "../server";
import { NotFoundException, ValidationException } from "../exceptions/http.exception";
import passwordUtil from "../utils/password.util";
import authMiddleware from "../middlewares/auth.middleware";
import { UserInterface } from "../interfaces/models.interface";

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
		const user = body as UserInterface;

		if (user.email.length < 4 || !user.email.match("@")) {
			throw new ValidationException("invalid-email");
		}

		if (user.password.length < 6) {
			throw new ValidationException("invalid-password");
		}

		if (await User.findOne({ where: { email: user.email }})) {
			throw new ValidationException("email-already-in-use");
		} 

		user.password = await passwordUtil.generatePasswordHash(user.password);
		const createdUser = await User.create(user);

		return res.status(201).json(createdUser);
	}

	private async get(req: Request, res: Response ): Promise<Response> {
		const { id } = req.params;
		const user = await User.findByPk(id, { include: {
			association: "leagueoflegendsAccount",
			include: [{ association: "leagueoflegendsSummoner" }],
		}});

		if (!user) {
			throw new NotFoundException("user-not-found");
		} 

		return res.json(user); 
	}

	private async update(req: Request, res: Response ): Promise<Response> {
		const { id, userId } = req.params;

		if (id !== userId) {
			throw new ValidationException("only-perform-by-owner");
		}

		const user = await User.findOne({ where: { id: id }});

		if (!user) {
			throw new NotFoundException("user-not-found");
		}

		await user.destroy();
		return res.json(user);
	}

	private async delete(req: Request, res: Response ): Promise<Response> {
		const { id, userId } = req.params;

		if (id !== userId.toString()) {
			throw new ValidationException("only-perform-by-owner");
		}

		const user = await User.findOne({ where: { id }});

		if (!user) {
			throw new NotFoundException("user-not-found");

		}

		await user.destroy();
		return res.json(user);
	}
}
