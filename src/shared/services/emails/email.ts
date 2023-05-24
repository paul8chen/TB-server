import nodemailer from 'nodemailer';

import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';

export interface IEmailOptions {
	from: string;
	to: string;
	subject: string;
	text: string;
	html: string;
}

const log = config.createLogger('email');

class EmailSender {
	public async sendEmail(options: IEmailOptions): Promise<void> {
		config.NODE_ENV === 'development' && this.sendEmailDev(options);
		config.NODE_ENV === 'production' && this.sendEmailProd(options);
	}

	private async sendEmailDev(options: IEmailOptions): Promise<void> {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: config.MAILTRAP_USER, // generated ethereal user
				pass: config.MAILTRAP_PASS // generated ethereal password
			}
		});

		try {
			await transporter.sendMail(options);
			log.info('Dev: email sent successfully');
		} catch (err) {
			log.error('Dev: email sent successfully');
			throw new ServerError('Dev: Failed to sent email');
		}
	}

	private async sendEmailProd(options: IEmailOptions): Promise<void> {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: 'smtp.sendgrid.net',
			port: 587,
			auth: {
				user: 'apikey',
				pass: config.SG_API_KEY
			}
		});

		try {
			await transporter.sendMail(options);
			log.info('Email sent successfully');
		} catch (err) {
			log.error('Email sent successfully');
			throw new ServerError('Failed to sent email');
		}
	}
}

export const emailsender = new EmailSender();
