import Server from './src/server';
import UserController from './src/controllers/user.controller';

const server = new Server([
    new UserController(),
]);

server.listen();