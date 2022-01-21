import Server from "./src/server";
import UserController from "./src/controllers/user.controller";
import AuthController from "./src/controllers/auth.controller";
import LeagueoflegendsController from "./src/controllers/leagueoflegends.controller";

const server = new Server([
    new UserController(),
    new AuthController(),
    new LeagueoflegendsController(),
]);

server.listen();
