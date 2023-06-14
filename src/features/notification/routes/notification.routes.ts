import express, { Router } from 'express';

import { Notification } from '@notification/controllers/notification';

class NotificationRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get('/get-notification', Notification.prototype.read);
		this.router.patch('/update-notification-read', Notification.prototype.update);

		return this.router;
	}
}

export const notificationRoutes = new NotificationRoute();
