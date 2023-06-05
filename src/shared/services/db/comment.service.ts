import { ICommentDocument, ICommentNameList, IGetCommentQuery } from '@comment/interfaces/comment.interface';
import { CommentModel } from '@comment/models/comment.schema';
import { BadRequestError } from '@global/helpers/error-handler';
// import { IPostDocument } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';

class CommentService {
	public async createComment(commentData: ICommentDocument): Promise<void> {
		const { postId } = commentData;

		const createCommentQuery = CommentModel.create(commentData);

		const udpatePostQuery = PostModel.findOneAndUpdate({ _id: postId }, { $inc: { commentsCount: 1 } }, { new: true });

		// For Notification featre...
		// const getUserQuery = PostModel.aggregate([
		// 	{ $match: { _id: postId } },
		// 	{ $lookup: { from: 'User', localField: 'username', foreignField: 'username', as: 'user' } },
		// 	{ $project: { user: 1 } }
		// ]);

		// const userData = (await Promise.all([createCommentQuery, udpatePostQuery, getUserQuery]))[-1];

		await Promise.all([createCommentQuery, udpatePostQuery]);
	}

	public async getAllComment(
		query: IGetCommentQuery,
		skip: number,
		limit: number,
		sort: { [key: string]: 1 | -1 } = { createdAt: -1 }
	): Promise<ICommentDocument[]> {
		const commentDatas = await CommentModel.find(query, { __v: 0 }, { skip, limit, sort });

		return commentDatas;
	}

	public async getComment(query: IGetCommentQuery): Promise<ICommentDocument> {
		const commentData = await CommentModel.findOne(query, { __v: 0 });
		if (!commentData) throw new BadRequestError('Comment not existed.');

		return commentData;
	}

	public async getCommentNames(query: IGetCommentQuery, sort: { [key: string]: 1 | -1 } = { createdAt: -1 }): Promise<ICommentNameList> {
		const commentDatas = await CommentModel.aggregate([
			{ $match: query },
			{ $sort: sort },
			{
				$group: {
					_id: null,
					names: { $addToSet: '$username' },
					count: { $sum: 1 }
				}
			},
			{ $project: { _id: 0 } }
		]);

		return commentDatas[0];
	}
}

export const commentService = new CommentService();
