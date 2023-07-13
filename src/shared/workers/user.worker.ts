import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { userService } from '@service/db/user.service';
import { tickService } from '@service/mysql/tick.service';

const log = config.createLogger('userWorker');

class UserWorker {
	async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { value } = job.data;

			await userService.createUser(value);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async addDefaultTickToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { defaultTick } = job.data;

			await tickService.createTick(defaultTick);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const userWorker = new UserWorker();
