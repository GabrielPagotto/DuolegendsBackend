import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware";
import Database from "./database/db.database";

export abstract class Controller {
	public abstract path: string;
	public abstract router: express.Router;
	public abstract initializeRoutes(): void;
}

class Server {
    private app: express.Application;
    private port: number | undefined;
    private database!: Database;

    constructor(controllers: Array<Controller>) {
        require("express-async-errors");
        dotenv.config();
        this.port = Number(process.env.SERVER_PORT);
        this.app = express();
        this.initializeMiddlewares();
        this.initializeDatabase();
        this.initializeControllers(controllers);
        this.initializeErrorMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan("tiny"));
    }

    private initializeDatabase() {
        this.database = new Database();
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller) => {
            controller.initializeRoutes();
            this.app.use(controller.path, controller.router);
        });
    }

    private initializeErrorMiddlewares() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        if (this.port) {
            this.app.listen(this.port, () => {
                console.log(`The server is running on http://localhost:${this.port}`);
            });
        } else {
            throw new Error("The server port was not informed in the environment variables. [SERVER_PORT]");
        }
    }
}

export default Server;
