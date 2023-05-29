import { BaseQueue } from './base.queue';
import { emailWorker } from '@worker/email.worker';
import { IEmailOptions } from '@service/emails/email';

export class EmailQueue extends BaseQueue<IEmailOptions> {
	constructor() {
		super('email');
		this.processJob('sendEmail', 5, emailWorker.sendEmail);
	}

	public addEmailJob(name: string, data: IEmailOptions) {
		this.addJob(name, data);
	}
}

export const emailQueue = new EmailQueue();
