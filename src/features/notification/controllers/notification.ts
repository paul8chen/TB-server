import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

// import { BadRequestError } from '@global/helpers/error-handler';
import { notificationService } from '@service/db/notification.service';

export class Notification {
	public async read(req: Request, res: Response): Promise<void> {
		const { userId } = req.currentUser!;

		const notificationData = await notificationService.getNotificationByUser(userId);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get notifications successed.', data: { notificationData } });
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { notificationId } = req.body;

		await notificationService.markNotificationRead(notificationId);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Notification marked as read successed.' });
	}
}
