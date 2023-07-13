import { BaseQueue } from './base.queue';
import { userWorker } from '@worker/user.worker';
import { IUserJob } from '@user/interfaces/user.interface';

export class UserQueue extends BaseQueue<IUserJob> {
	constructor() {
		super('user');
		this.processJob('addUserToDB', 5, userWorker.addUserToDB);
		this.processJob('addDefaultTickToDB', 5, userWorker.addDefaultTickToDB);
	}

	public addUserJob(name: string, data: IUserJob) {
		this.addJob(name, data);
	}
}

export const userQueue = new UserQueue();
