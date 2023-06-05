import { Application } from 'express';

import { config } from '@root/config';
import { authRoutes } from '@auth/routes/authRoutes';
import { authmiddleware } from '@global/middlewares/auth.middleware';
import { currentUserRoutes } from '@auth/routes/currentUserRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { stockRoutes } from '@stock/routes/stockRoutes';
import { postRoutes } from '@post/routes/postRoutes';
import { reactionRoutes } from '@reaction/routes/reactionRoutes';
import { commentRoutes } from '@comment/routes/comment.routes';

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

		// Authenticated Route
		app.use(`${config.BASE_PATH}`, authmiddleware.verifyUser);

		// Current user Route
		app.use(`${config.BASE_PATH}/current`, currentUserRoutes.routes());
		// Post Route
		app.use(`${config.BASE_PATH}/post`, postRoutes.routes());
		// Reaction Route
		app.use(`${config.BASE_PATH}/reaction`, reactionRoutes.routes());
		// Comment Route
		app.use(`${config.BASE_PATH}/comment`, commentRoutes.routes());
	};

	routes();
};
