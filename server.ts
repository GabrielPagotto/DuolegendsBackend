import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import * as routes from './src/routes';
import * as mongodb from './src/mongodb.database';

dotenv.config();

const port = process.env.SERVER_PORT;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("tiny"));

mongodb.initConnection();
routes.init(server);

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
