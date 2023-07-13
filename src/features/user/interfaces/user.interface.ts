import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InferAttributes } from 'sequelize';

import { Tick } from '@stock/models/tick.schema';

export interface IUserDocument extends Document {
	_id: string | ObjectId;
	authId: string | ObjectId;
	username?: string;
	email?: string;
	password?: string;
	uId?: string;
	postsCount: number;
	bgImageVersion: string;
	bgImageId: string;
	profilePicture: string;
	createdAt?: Date;
}

export interface IResetPasswordParams {
	username: string;
	email: string;
	ipaddress: string;
	date: string;
}

export interface ISearchUser {
	_id: string;
	profilePicture: string;
	username: string;
	email: string;
	avatarColor: string;
}

export interface ILogin {
	userId: string;
}

export interface IEmailJob {
	receiverEmail: string;
	template: string;
	subject: string;
}

export interface IUserJob {
	value?: IUserDocument;
	defaultTick?: InferAttributes<Tick>;
}
