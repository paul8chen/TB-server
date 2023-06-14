import { ObjectId } from 'mongodb';

import { NotificationModel } from '@notification/models/notification.schema';
import { AuthModel } from '@auth/models/auth.schema';
import { PostModel } from '@post/models/post.schema';
import { INotificationJobData, INotificationDocument } from '@notification/interfaces/notification.interface';
import { notificationSocketIO } from '@socket/notification.socket';

class NotificationService {
	public async createNotification(data: INotificationJobData): Promise<void> {
		const { username, postId } = data;
		const userFromQuery = AuthModel.aggregate([
			{ $match: { username } },
			{ $lookup: { from: 'User', localField: '_id', foreignField: 'authId', as: 'userFrom' } },
			{ $unwind: '$userFrom' },
			{ $replaceWith: '$userFrom' },
			{ $project: { _id: 1 } }
		]);
		const userToQuery = PostModel.aggregate([
			{ $match: { _id: new ObjectId(postId) } },
			{ $lookup: { from: 'Auth', localField: 'username', foreignField: 'username', as: 'authTo' } },
			{ $unwind: '$authTo' },
			{ $lookup: { from: 'User', localField: 'authTo._id', foreignField: 'authId', as: 'userTo' } },
			{ $unwind: '$userTo' },
			{ $replaceWith: '$userTo' },
			{ $project: { _id: 1 } }
		]);

		const [userFromData, userToData] = await Promise.all([userFromQuery, userToQuery]);
		const userFrom: ObjectId = new ObjectId(userFromData[0]._id);
		const userTo: ObjectId = new ObjectId(userToData[0]._id);

		const notificationData: INotificationDocument = { ...data, userTo, userFrom } as unknown as INotificationDocument;

		const notificationDataFromDB = await NotificationModel.create(notificationData);

		notificationSocketIO.emit('addNotification', notificationDataFromDB);
	}

	public async getNotificationByUser(userId: string): Promise<INotificationDocument[]> {
		const notificationData: INotificationDocument[] = await NotificationModel.aggregate([
			{ $match: { userTo: new ObjectId(userId), read: false } },
			{ $lookup: { from: 'User', localField: 'userFrom', foreignField: '_id', as: 'userFrom' } },
			{ $unwind: '$userFrom' },
			{ $addFields: { profilePicture: '$userFrom.profilePicture', userFrom: '$userFrom._id' } }
		]);

		return notificationData;
	}

	public async markNotificationRead(notificationId: string): Promise<void> {
		notificationSocketIO.emit('updateNotification', notificationId);

		await NotificationModel.updateOne({ _id: notificationId }, { read: true });
	}
}

export const notificationService = new NotificationService();
