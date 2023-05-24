import { Request, Response } from 'express';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { authService } from '@service/db/auth.service';

export class Password {
	@joiValidation(emailSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { email } = req.body;
		const authData: IAuthDocument = await authService.getAuthByEmail(email);
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials');
		}

		const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
		const randomCharacters: string = randomBytes.toString('hex');
		await authService.updatePasswordToken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);

		const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
		const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
		emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
		res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
	}
}
