import { BaseQueue } from './base.queue';
import { authWorker } from '@worker/auth.worker';
import { IAuthJob } from '@auth/interfaces/auth.interface';

export class AuthQueue extends BaseQueue<IAuthJob> {
	constructor() {
		super('auth');
		this.processJob('addAuthToDB', 5, authWorker.addAuthToDB);
	}

	public addAuthJob(name: string, data: IAuthJob) {
		this.addJob(name, data);
	}
}

export const authQueue = new AuthQueue();
