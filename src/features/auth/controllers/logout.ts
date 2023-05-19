import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Logout {
	public clearSession(req: Request, res: Response): void {
		if (!req.session) return;

		req.session.token = null;

		res.status(HTTP_STATUS.ACCEPTED).json({ message: 'Logout successfully.' });
	}
}
