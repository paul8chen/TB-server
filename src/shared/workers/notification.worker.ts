import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { notificationService } from '@service/db/notification.service';
import { INotificationJobData } from '@notification/interfaces/notification.interface';

const log = config.createLogger('notificationWorker');

class NotificationWorker {
	async addNotificationToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const notificationJobData: INotificationJobData = job.data.notificationJobData;
			await notificationService.createNotification(notificationJobData);

			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const notificationWorker = new NotificationWorker();
