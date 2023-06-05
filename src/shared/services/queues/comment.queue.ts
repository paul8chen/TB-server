import { BaseQueue } from './base.queue';
import { commentWorker } from '@worker/comment.worker';
import { ICommentJob } from '@comment/interfaces/comment.interface';

export class CommentQueue extends BaseQueue<ICommentJob> {
	constructor() {
		super('comment');
		this.processJob('addCommentToDB', 5, commentWorker.addCommentToDB);
	}

	public addCommentJob(name: string, data: ICommentJob) {
		this.addJob(name, data);
	}
}

export const commentQueue = new CommentQueue();
