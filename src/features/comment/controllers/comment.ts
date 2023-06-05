import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';

import { addCommentSchema } from '@comment/schemes/comment.scheme';
import { ICommentDocument } from '@comment/interfaces/comment.interface';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';
import { withCacheOpen } from '@global/helpers/cacheOpen';
import { CommentCache } from '@service/redis/comment.cache';
import { commentService } from '@service/db/comment.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { commentQueue } from '@service/queues/comment.queue';

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

		commentQueue.addCommentJob('addCommentToDB', { commentData });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Save comment successed.' });
	}

	public async readAllComment(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		if (!postId) throw new BadRequestError('Invalid postId.');

		const page = req.query.page ? +req.query.page : 1;
		const postPerPage = +config.BASE_PAGE_LIMIT;
		const skip = (page - 1) * postPerPage;
		const limit = page * postPerPage;

		let commentDatas = await commentCache.getAllCommentFromCache(postId);
		if (!commentDatas.length) commentDatas = await commentService.getAllComment({ postId }, skip, limit);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all comments successed', commentDatas });
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
}
