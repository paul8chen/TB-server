import { IReactions } from '@reaction/interfaces/reaction.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IPostDocument extends Document {
	_id?: string | ObjectId;
	userId: string;
	username: string;
	email: string;
	avatarColor: string;
	profilePicture: string;
	post: string;
	bgColor: string;
	commentsCount: number;
	imgVersion?: string;
	imgId?: string;
	privacy?: string;
	reactions?: IReactions;
	createdAt?: Date;
}

export interface IGetPostsQuery {
	_id?: ObjectId | string;
	username?: string;
}

export interface ISavePostToCache {
	key: ObjectId | string;
	currentUserId: string;
	uId: string;
	createdPost: IPostDocument;
}

export interface IPostJob {
	key?: string;
	value?: IPostDocument;
	keyOne?: string;
	keyTwo?: string;
}

export interface IQueryComplete {
	ok?: number;
	n?: number;
}

export interface IQueryDeleted {
	deletedCount?: number;
}
