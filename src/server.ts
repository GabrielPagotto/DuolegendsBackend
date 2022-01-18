import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import { initDatabase } from "./database/db.database";

export abstract class Controller {
	public abstract path: string;
	public abstract router: express.Router;
	public abstract initializeRoutes(): void;
    public authenticationRequired: boolean = true;
}

class Server {
    private app: express.Application;
    private port: number | undefined;

    constructor(controllers: Array<Controller>) {
        require("express-async-errors");
        dotenv.config();
        this.port = Number(process.env.SERVER_PORT);
        this.app = express();
        this.initializeMiddlewares();
        this.initializeDatabase();
        this.initializeMongoDbConnection();
        this.initializeControllers(controllers);
        this.initializeErrorMiddlewares();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan("tiny"));
    }

    private initializeDatabase() {
        initDatabase();
    }

    private initializeMongoDbConnection() {
        const mongooseUrlConnection = process.env.MONGODB_URL_CONNECTION;
        if (mongooseUrlConnection) {
            mongoose.connect(mongooseUrlConnection).then(() => {
                console.log("MongoDB database connected successfully");
            }).catch((err) => {
                console.log("Failed to connect to MongoDB database");
                throw err;
            });
        } else {
            throw new Error("The connection url to mongodb was not informed in the environment variables. [MONGODB_URL_CONNECTION]");
        }
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller) => {
            controller.initializeRoutes();
            if (controller.authenticationRequired) {
                this.app.use(controller.path, authMiddleware, controller.router);
            } else {
                this.app.use(controller.path, controller.router);
            }
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
