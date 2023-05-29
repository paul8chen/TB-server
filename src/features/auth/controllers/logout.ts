import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Logout {
	public update(req: Request, res: Response): void {
		if (!req.session) return;

		req.session.token = null;

		res.status(HTTP_STATUS.ACCEPTED).json({ status: 'success', message: 'Logout successfully.' });
	}
}
