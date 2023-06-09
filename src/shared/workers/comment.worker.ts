import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { commentService } from '@service/db/comment.service';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

const log = config.createLogger('commentWorker');

class CommentWorker {
	async addCommentToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const commentData: ICommentDocument = job.data.commentData;

			await commentService.createComment(commentData);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async updateCommentInDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const commentData: ICommentDocument = job.data.commentData;

			await commentService.updateCommentByPostIdAndCommentId(commentData);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async deleteCommentFromDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { postId, _id } = job.data.commentData;

			await commentService.deleteCommentByPostIdAndCommentId(postId, _id);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const commentWorker = new CommentWorker();
