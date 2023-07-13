import mongoose, { model, Model, Schema } from 'mongoose';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

const commentSchema: Schema = new Schema(
	{
		postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
		comment: { type: String, default: '' },
		username: { type: String }
	},
	{ timestamps: { createdAt: 'createdAt' } }
);

const CommentModel: Model<ICommentDocument> = model<ICommentDocument>('Comment', commentSchema, 'Comment');
export { CommentModel };
