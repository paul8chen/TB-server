import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IReactionDocument extends Document {
	_id?: string | ObjectId;
	username: string;
	avatarColor: string;
	type: keyof IReactions;
	postId: string;
	profilePicture: string;
	createdAt?: Date;
}

export interface IReactions {
	like: number;
	love: number;
	happy: number;
	wow: number;
	sad: number;
	angry: number;
}

export interface IReactionJob {
	reactionData: IReactionDocument;
	reactions: IReactions;
}

export interface IQueryReaction {
	_id?: string | ObjectId;
	postId?: string | ObjectId;
}

export interface IReaction {
	senderName: string;
	type: string;
}
