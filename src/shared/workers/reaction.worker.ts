import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { reactionService } from '@service/db/reaction.service';

const log = config.createLogger('reactionWorker');

class ReactionWorker {
	async addReactionToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { reactionData, reactions } = job.data;

			await reactionService.createReaction(reactionData, reactions);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async deleteReactionFromDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { reactionData, reactions } = job.data;

			await reactionService.deleteReaction(reactionData, reactions);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}

	async updateReactionToDB(job: Job, done: DoneCallback): Promise<void> {
		try {
			const { reactionData, reactions } = job.data;

			await reactionService.updateReaction(reactionData, reactions);
			job.progress(100);
			done(null, job.data);
		} catch (err) {
			log.error(err);
			done(err as Error);
		}
	}
}

export const reactionWorker = new ReactionWorker();
