import { Express } from 'express';

import userRouter from './routes/user.routes';

export function init(server: Express): void {
	server.use('/users', userRouter);
}
