import { BaseQueue } from './base.queue';
import { postWorker } from '@worker/post.worker';
import { IPostJob } from '@post/interfaces/post.interface';

export class PostQueue extends BaseQueue<IPostJob> {
	constructor() {
		super('post');
		this.processJob('addPostToDB', 5, postWorker.addPostToDB);
		this.processJob('deletePostFromDB', 5, postWorker.deletePostFromDB);
		this.processJob('updatePostToDB', 5, postWorker.updatePostToDB);
	}

	public addPostJob(name: string, data: IPostJob) {
		this.addJob(name, data);
	}
}

export const postQueue = new PostQueue();
