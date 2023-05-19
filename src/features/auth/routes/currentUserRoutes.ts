import { Router } from 'express';

import { CurrentUser } from '@auth/controllers/currentUser';
import { authmiddleware } from '@global/middlewares/auth.middleware';

class CurrentUserRoutes {
	private router: Router;

	constructor() {
		this.router = Router();
	}

	public routes(): Router {
		this.router.get('/currentUser', authmiddleware.checkAuthentication, CurrentUser.prototype.read);

		return this.router;
	}
}

export const currentUserRoutes = new CurrentUserRoutes();
