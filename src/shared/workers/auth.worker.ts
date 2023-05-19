import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';

const log = config.createLogger('authWorker');

class AuthWorker {
	async addAuthToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { value: authData } = job.data;

			await authService.createAuth(authData);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const authWorker = new AuthWorker();
