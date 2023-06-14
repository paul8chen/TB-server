import { BaseQueue } from './base.queue';
import { notificationWorker } from '@worker/notification.worker';
import { INotificationJob } from '@notification/interfaces/notification.interface';

class NotificationQueue extends BaseQueue<INotificationJob> {
	constructor() {
		super('notification');
		this.processJob('addNotificationToDB', 5, notificationWorker.addNotificationToDB);
	}

	public addNotificationJob(name: string, data: INotificationJob) {
		this.addJob(name, data);
	}
}

export const notificationQueue = new NotificationQueue();
