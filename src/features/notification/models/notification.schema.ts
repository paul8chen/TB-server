import mongoose, { model, Model, Schema } from 'mongoose';

import { INotificationDocument } from '@notification/interfaces/notification.interface';

const notificationSchema: Schema = new Schema({
	userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
	userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	read: { type: Boolean, default: false },
	notificationType: String,
	message: { type: String, default: '' },
	comment: { type: String, default: '' },
	reaction: { type: String, default: '' },
	postId: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now() }
});

const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>('Notification', notificationSchema, 'Notification');

export { NotificationModel };
