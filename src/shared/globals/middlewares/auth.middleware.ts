import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { NotAuthorizedError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { AuthPayload } from '@auth/interfaces/auth.interface';

class Authmiddleware {
	public verifyUser(req: Request, res: Response, next: NextFunction): void {
		if (!req.session?.token) throw new NotAuthorizedError('You are not login. Please login to continue.');

		const { token } = req.session;
		try {
			const payload = jwt.verify(token, config.JWT_TOKEN) as AuthPayload;

			req.currentUser = payload;

		} catch (err) {
			throw new NotAuthorizedError('Authentication failed. Please login again.');
		}

		next();
	}

	public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
		if (!req.currentUser) throw new NotAuthorizedError('You are not login. Please login to continue!');

		next();
	}

	public isLoggedin(req: Request, res: Response, next: NextFunction): void | NextFunction {
		if (!req.session?.token) return next();

		const { token } = req.session;
		try {
			const payload = jwt.verify(token, config.JWT_TOKEN) as AuthPayload;
			req.currentUser = payload;
		} catch (err) {
			return next();
		}

		next();
	}

	public isAdmin(req: Request, res: Response, next: NextFunction): void {

		if (req.currentUser!.user !== 'admin') throw new NotAuthorizedError('You are not authorized for this route.');

		next();
	}
}

export const authmiddleware = new Authmiddleware();
