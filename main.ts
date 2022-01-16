import Server from "./src/server";
import UserController from "./src/controllers/user.controller";
import AuthController from "./src/controllers/auth.controller";

const server = new Server([
    new UserController(),
    new AuthController(),
]);

server.listen();
