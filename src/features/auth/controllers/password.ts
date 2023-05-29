import { Request, Response } from 'express';
import crypto from 'crypto';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import EmailTemplate from '@service/emails/emailTemplate';
import { config } from '@root/config';
import { IEmailOptions } from '@service/emails/email';
import { emailQueue } from '@service/queues/email.queue';

export class Password {
	@joiValidation(emailSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const email: string = req.body.email;
		const authData = await authService.getAuthByEmail(email);
		if (!authData) {
			throw new BadRequestError('Invalid credentials');
		}

		const randomBytes = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters = randomBytes.toString('hex');
		await authService.updatePasswordTokenById(`${authData._id!}`, randomCharacters, new Date(Date.now() + 60 * 60 * 1000));

		const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;

		const template = await EmailTemplate.prototype.forgotPasswordTemplate(authData.username, resetLink);

		const emailOptions = {
			from: 'TradingBook',
			to: email,
			text: resetLink,
			html: template,
			subject: 'Reset password link'
		};

		emailQueue.addEmailJob('sendEmail', emailOptions);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Password reset email sent.' });
	}

	@joiValidation(passwordSchema)
	public async update(req: Request, res: Response): Promise<void> {
		const { token } = req.query;
		console.log('token', token);
		if (!token) throw new BadRequestError('Invalid token');

		const authData = await authService.getUserByPasswordToken(token as string);
		if (!authData) throw new BadRequestError('Invalid token');
		if (authData.passwordResetExpires! < new Date()) throw new BadRequestError('Token has expired.');

		const { password } = req.body;

		authData.password = password;
		authData.passwordResetToken = undefined;
		authData.passwordResetExpires = undefined;
		await authData.save();

		const template = await EmailTemplate.prototype.resetPasswordTemplate(authData.username);

		const emailOptions = {
			from: 'TradingBook',
			to: authData.email,
			text: 'Your password has reset.',
			html: template,
			subject: 'Password reset completed.'
		};

		emailQueue.addEmailJob('sendEmail', emailOptions);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Password reset successfully.' });
	}
}
