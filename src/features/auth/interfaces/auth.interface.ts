import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IUserDocument } from '@user/interfaces/user.interface';

declare global {
	namespace Express {
		interface Request {
			currentUser?: AuthPayload;
		}
	}
}

export interface AuthPayload {
	userId: string;
	uId: string;
	email: string;
	username: string;
	user: string;
	iat?: number;
}

export interface IAuthDocument extends Document {
	_id: string | ObjectId;
	uId: string;
	username: string;
	user: string;
	email: string;
	password?: string;
	createdAt: Date;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	comparePassword(password: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
	_id: ObjectId;
	uId: string;
	email: string;
	username: string;
	user: string;
	password: string;
}

export interface IAuthJob {
	value?: string | IAuthDocument | IUserDocument;
}
