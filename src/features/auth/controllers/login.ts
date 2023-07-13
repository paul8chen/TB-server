import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';

import { config } from '@root/config';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { loginSchema } from '@auth/schemes/login';
import { authService } from '@service/db/auth.service';
import { BadRequestError, ServerError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { userService } from '@service/db/user.service';

export class Login {
	@joiValidation(loginSchema)
	public async read(req: Request, res: Response): Promise<void> {
		const { username, password } = req.body;

		// 1) Check if username exists.
		const authData = await authService.getUserByUsername(username);
		if (!authData) throw new BadRequestError('User not exist.');

		// 2) Check if password is valid
		const passwordIsValid = await authData.comparePassword(password);
		if (!passwordIsValid) throw new BadRequestError('Invalid password.');

		const user = await userService.getUserByAuthId(authData._id);
		if (!user) throw new ServerError('Internal error.');

		// 3) Add token in cookies
		const token = Login.prototype.signupToken(authData, user._id as ObjectId);
		req.session = { token };

		// 4) Send response with user data and token to client
		const { uId, email, createdAt } = authData;
		const clientData = { username, uId, email, createdAt };
		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Login successfully', data: { user: clientData, token } });
	}

	private signupToken(data: IAuthDocument, userObjectId: ObjectId): string {
		const { uId, email, username, user } = data;

		const token = jwt.sign(
			{
				userId: userObjectId,
				user,
				uId,
				email,
				username
			},
			config.JWT_TOKEN
		);

		return token;
	}
}
