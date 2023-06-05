import { BaseQueue } from './base.queue';
import { reactionWorker } from '@worker/reaction.worker';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';

export class ReactionQueue extends BaseQueue<IReactionJob> {
	constructor() {
		super('reaction');
		this.processJob('addReactionToDB', 5, reactionWorker.addReactionToDB);
		this.processJob('deleteReactionFromDB', 5, reactionWorker.deleteReactionFromDB);
		this.processJob('updateReactionToDB', 5, reactionWorker.updateReactionToDB);
	}

	public addReactionJob(name: string, data: IReactionJob) {
		this.addJob(name, data);
	}
}

export const reactionQueue = new ReactionQueue();
