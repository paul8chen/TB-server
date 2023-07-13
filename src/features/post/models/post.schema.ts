import mongoose, { model, Schema } from 'mongoose';
import { IPostDocument } from '@post/interfaces/post.interface';

const postSchema: Schema = new Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
	username: { type: String },
	email: { type: String },
	profilePicture: { type: String },
	post: { type: String, default: '' },
	imgVersion: { type: String, default: '' },
	imgId: { type: String, default: '' },
	commentsCount: { type: Number, default: 0 },
	reactions: {
		rocket: { type: Number, default: 0 },
		bullish: { type: Number, default: 0 },
		bearish: { type: Number, default: 0 }
	},
	createdAt: { type: Date, default: Date.now }
});

const PostModel = model<IPostDocument>('Post', postSchema, 'Post');

export { PostModel };
