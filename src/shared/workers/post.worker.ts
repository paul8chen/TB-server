import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { postService } from '@service/db/post.service';

const log = config.createLogger('postWorker');

class PostWorker {
	async addPostToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { key, value } = job.data;

			await postService.createPost(key, value);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async deletePostFromDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { keyOne, keyTwo } = job.data;

			await postService.deletePost(keyOne, keyTwo);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async updatePostToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { key, value } = job.data;

			await postService.updatePost(key, value);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const postWorker = new PostWorker();
