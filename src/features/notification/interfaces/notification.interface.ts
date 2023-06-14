import mongoose, { Document } from 'mongoose';

export interface INotificationDocument extends Document {
	_id?: mongoose.Types.ObjectId | string;
	userTo: string;
	userFrom: string;
	message: string;
	notificationType: string;
	comment: string;
	reaction: string;
	postId: string;
	read?: boolean;
	createdAt?: Date;
}

export interface INotification {
	userTo: string;
	userFrom: string;
	message: string;
	notificationType: string;
	comment: string;
	reaction: string;
	postId: string;
	createdAt: Date;
}

export interface INotificationJobData {
	username: string;
	comment: string;
	reaction: string;
	postId: string;
	notificationType: string;
	message: string;
}

export interface INotificationJob {
	notificationJobData: INotificationJobData;
}
