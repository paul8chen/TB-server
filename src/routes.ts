import { Application } from 'express';

import { config } from '@root/config';
import { authRoutes } from '@auth/routes/authRoutes';
import { authmiddleware } from '@global/middlewares/auth.middleware';
import { currentUserRoutes } from '@auth/routes/currentUserRoutes';
import { serverAdapter } from '@service/queues/base.queue';

export default (app: Application): void => {
	const routes = () => {
		app.use('/queues', serverAdapter.getRouter());
		app.use(config.BASE_PATH, authRoutes.routes());
		app.use(config.BASE_PATH, authRoutes.logoutRoute());

		app.use(config.BASE_PATH, authmiddleware.verifyUser, currentUserRoutes.routes());
		// app.use(config.BASE_PATH, (req, res) => {
		// 	res.status(200).json({ status: 'success' });
		// });
	};

	routes();
};
