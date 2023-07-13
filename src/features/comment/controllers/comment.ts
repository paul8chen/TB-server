import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';

import { addCommentSchema } from '@comment/schemes/comment.scheme';
import { ICommentDocument } from '@comment/interfaces/comment.interface';
import { config } from '@root/config';
import { BadRequestError, ServerError } from '@global/helpers/error-handler';
import { withCacheOpen } from '@global/helpers/cacheOpen';
import { CommentCache } from '@service/redis/comment.cache';
import { commentService } from '@service/db/comment.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { commentQueue } from '@service/queues/comment.queue';
import { notificationQueue } from '@service/queues/notification.queue';
import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { postSocketIO } from '@socket/post.socket';

const commentCache = withCacheOpen(new CommentCache());

export class Comment {
	@joiValidation(addCommentSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const commentId = new ObjectId();
		const postId: string = req.body.postId;
		const comment: string = req.body.comment;
		const { username } = req.currentUser!;

		const commentData: ICommentDocument = { _id: commentId, postId, username, comment } as ICommentDocument;

		await commentCache.saveCommentToCache(commentData);

		postSocketIO.emit('addComment', commentData);

		commentQueue.addCommentJob('addCommentToDB', { commentData });

		const notificationJobData: INotificationJobData = {
			username,
			comment,
			postId,
			notificationType: 'comment',
			reaction: '',
			message: `${username} reply to your post: ${comment}`
		};
		notificationQueue.addNotificationJob('addNotificationToDB', { notificationJobData });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Save comment successed.' });
	}

	public async readAllComment(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		if (!postId) throw new BadRequestError('Invalid postId.');

		const page = req.params.page ? +req.params.page : 1;
		const postPerPage = +config.BASE_PAGE_LIMIT;
		const skip = (page - 1) * postPerPage;
		const limit = page * postPerPage;

		let [commentDatas, totalComments] = await Promise.all([
			commentCache.getAllCommentFromCache(postId, skip, limit - 1),
			commentCache.getTotalPostCommentsFromCache(postId)
		]);

		if (!commentDatas.length) {
			[commentDatas, totalComments] = await Promise.all([
				commentService.getAllComment({ postId }, skip, limit),
				commentService.getTotalComment(postId)
			]);
		}

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all comments successed', data: { commentDatas, totalComments } });
	}

	public async readAllCommentNameList(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		if (!postId) throw new BadRequestError('Invalid postId.');

		let commentNameList = await commentCache.getAllCommentNameFromCache(postId);
		if (!commentNameList.count) commentNameList = await commentService.getCommentNames({ postId: new ObjectId(postId) });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all comment name list successed.', commentNameList });
	}

	public async read(req: Request, res: Response): Promise<void> {
		const { postId, commentId } = req.params;

		const commentData =
			(await commentCache.getCommentByIdFromCache(postId, commentId)) ||
			(await commentService.getComment({ postId: new ObjectId(postId), _id: commentId }));

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get comment successed', commentData });
	}

	public async update(req: Request, res: Response): Promise<void> {
		const { postId, _id, comment } = req.body;
		const { username } = req.currentUser!;

		const commentData: ICommentDocument = { _id, postId, username, comment } as ICommentDocument;

		const updatedStatus = await commentCache.updatePostCommentFromCache(commentData);

		if (!updatedStatus) throw new ServerError('Update comment failed. Please try again.');

		await new Promise((resolve) =>
			setTimeout(() => {
				resolve('');
			}, 3000)
		);
		postSocketIO.emit('updateComment', commentData);

		commentQueue.addCommentJob('updateCommentInDB', { commentData });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Update comment successed.' });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { postId, _id, comment } = req.body;
		const { username } = req.currentUser!;

		const commentData: ICommentDocument = { _id, postId, username, comment } as ICommentDocument;

		await commentCache.deleteCommentFromCache(commentData);

		postSocketIO.emit('deleteComment', commentData);

		commentQueue.addCommentJob('deleteCommentFromDB', { commentData });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Delete comment successed.' });
	}
}
