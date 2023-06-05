import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface ICommentDocument extends Document {
	_id?: string | ObjectId;
	username: string;
	postId: string;
	comment: string;
	createdAt?: Date;
}

export interface ICommentJob {
	commentData: ICommentDocument;
}

export interface ICommentNameList {
	count: number;
	names: string[];
}

export interface IGetCommentQuery {
	_id?: string | ObjectId;
	postId?: string | ObjectId;
}

export interface IQuerySort {
	createdAt?: number;
}
