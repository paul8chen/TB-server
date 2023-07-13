import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import jwt from 'jsonwebtoken';
import { InferAttributes } from 'sequelize';

import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { authService } from '@service/db/auth.service';
import { Helpers } from '@global/helpers/Helpers';
import { uploads } from '@global/helpers/cloudinary-upload';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { UserCache } from '@service/redis/user.cache';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';
import { config } from '@root/config';
import { emailQueue } from '@service/queues/email.queue';
import { Tick } from '@stock/models/tick.schema';

const userCache = new UserCache();

export class SignUp {
	@joiValidation(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarImage } = req.body;
		let { user } = req.body;
		user ??= 'user';

		const checkIfUserExist = await authService.getUserByUsernameOrEmail(username, email);

		if (checkIfUserExist) throw new BadRequestError('Username/Email already exists.');

		const authObjectId = new ObjectId();
		const userObjectId = new ObjectId();
		const uId = '' + Helpers.generateRandomInt(12);

		const authData = SignUp.prototype.signupDataToAuthData({ _id: authObjectId, uId, username, email, password, user });

		// Upload user profile image to cloudinary
		const uploadResult = await uploads(avatarImage, '' + userObjectId, true, true);
		if (!uploadResult?.public_id) throw new BadRequestError('Upload filed. Please try again.');

		// Add userData to REDIS
		const userData = SignUp.prototype.authDataToUserData(authData, userObjectId);
		userData.profilePicture = uploadResult.url;
		await userCache.saveUserToCache('' + userObjectId, uId, userData);

		// Add authData to DB
		const userDataWOAuth: IUserDocument = omit(userData, ['username', 'email', 'password', 'uId']);
		const defaultTick: InferAttributes<Tick> = {
			tickName: 'default',
			totalIndicator: 0,
			uId
		};

		authQueue.addAuthJob('addAuthToDB', { value: authData });
		userQueue.addUserJob('addUserToDB', { value: userDataWOAuth });
		userQueue.addUserJob('addDefaultTickToDB', { defaultTick });

		// Send signup eamil to user
		const emailOptions = {
			from: 'TradingBook',
			to: email,
			subject: 'Test',
			text: 'Welcome to TradingBook',
			html: '<b>Welcome to TradingBook</b>'
		};

		emailQueue.addEmailJob('sendEmail', emailOptions);

		const token = SignUp.prototype.signupToken(authData, userObjectId);
		req.session = { token };

		res
			.status(HTTP_STATUS.CREATED)
			.json({ status: 'success', message: 'User created successfully', data: { user: userDataWOAuth, token } });
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

	private signupDataToAuthData(data: ISignUpData): IAuthDocument {
		const { _id, uId, username, email, password, user } = data;

		const authData = {
			user,
			_id,
			uId,
			password,
			username: Helpers.firstLetterUppercase(username),
			email: email.toLowerCase(),
			createdAt: new Date()
		};

		return authData as unknown as IAuthDocument;
	}

	private authDataToUserData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
		const { _id, username, email, uId, password } = data;

		const userData = {
			_id: userObjectId,
			authId: _id,
			uId,
			username: Helpers.firstLetterUppercase(username),
			email,
			password,
			profilePicture: '',
			postsCount: 0
		} as unknown as IUserDocument;

		return userData;
	}
}
