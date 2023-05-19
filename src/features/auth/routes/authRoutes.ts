import express, { Router } from 'express';

import { SignUp } from '@auth/controllers/signup';
import { Login } from '@auth/controllers/login';
import { Logout } from '@auth/controllers/logout';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/signup', SignUp.prototype.create);
		this.router.post('/login', Login.prototype.read);

		return this.router;
	}

	public logoutRoute(): Router {
		this.router.get('/logout', Logout.prototype.clearSession);

		return this.router;
	}
}

export const authRoutes = new AuthRoutes();
