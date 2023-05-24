import { Application } from 'express';

import { config } from '@root/config';
import { authRoutes } from '@auth/routes/authRoutes';
import { authmiddleware } from '@global/middlewares/auth.middleware';
import { currentUserRoutes } from '@auth/routes/currentUserRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { stockRoutes } from '@stock/routes/stockRoutes';

export default (app: Application): void => {
	const routes = () => {
		app.use('/queues', serverAdapter.getRouter());

		// Auth Route
		app.use(`${config.BASE_PATH}/auth`, authRoutes.routes());
		app.use(`${config.BASE_PATH}/auth`, authRoutes.logoutRoute());

		// Stock Route
		app.use(`${config.BASE_PATH}/stock`, stockRoutes.routes());
		app.use(`${config.BASE_PATH}/stock`, stockRoutes.indicatorRoute());
		app.use(`${config.BASE_PATH}/stock`, stockRoutes.tickRoute());
		app.use(`${config.BASE_PATH}/stock`, stockRoutes.loadStockRoute());

		// Current user Route
		app.use(`${config.BASE_PATH}/current`, authmiddleware.verifyUser, currentUserRoutes.routes());
	};

	routes();
};
