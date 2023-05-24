import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { emailsender } from '@service/emails/email';

const log = config.createLogger('emailWorker');

class EmailWorker {
	async sendEmail(job: Job, done: DoneCallback): Promise<void> {
		try {
			await emailsender.sendEmail(job.data);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const emailWorker = new EmailWorker();
