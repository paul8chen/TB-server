import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { UserCache } from '@service/redis/user.cache';
import { userService } from '@service/db/user.service';
import { ServerError } from '@global/helpers/error-handler';

const userCache = new UserCache();

export class CurrentUser {
	public async read(req: Request, res: Response): Promise<void> {
		const userId = req.currentUser!.userId;

		const userData = (await userCache.getUserFromCache(userId)) || (await userService.getUserByUserId(userId));
		if (!userData) throw new ServerError('Server internal error.');

		const { token } = req.session!;
		console.log('successed');
		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get current user successfully.', data: { user: userData, token } });
	}
}
