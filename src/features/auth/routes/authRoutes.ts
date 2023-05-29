import express, { Router } from 'express';

import { SignUp } from '@auth/controllers/signup';
import { Login } from '@auth/controllers/login';
import { Logout } from '@auth/controllers/logout';
import { Password } from '@auth/controllers/password';

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/signup', SignUp.prototype.create);
		this.router.post('/login', Login.prototype.read);
		this.router.post('/forgot-password', Password.prototype.create);
		this.router.post('/reset-password', Password.prototype.update);

		return this.router;
	}

	public logoutRoute(): Router {
		this.router.get('/logout', Logout.prototype.update);

		return this.router;
	}
}

export const authRoutes = new AuthRoutes();
