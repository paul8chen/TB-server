import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { addReactionSchema, udpateReactionSchema } from '@reaction/schemes/reaction.scheme';
import { ReactionCache } from '@service/redis/reaction.cache';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { withCacheOpen } from '@global/helpers/cacheOpen';
import { BadRequestError, ServerError } from '@global/helpers/error-handler';
import { reactionQueue } from '@service/queues/reaction.queue';
import { reactionService } from '@service/db/reaction.service';

const reactionCache = withCacheOpen<ReactionCache>(new ReactionCache());

export class Reaction {
	public async read(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		if (!postId) throw new BadRequestError('PostId is missing.');

		let reactionDatas = await reactionCache.getAllReactionDataFromCache(postId);

		if (!reactionDatas.length) reactionDatas = await reactionService.getAllReaction(postId);

		res
			.status(HTTP_STATUS.OK)
			.json({ status: 'success', message: 'Get all reactions successfully.', reactionDatas, total: reactionDatas.length });
	}

	@joiValidation(addReactionSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, avatarColor } = req.currentUser!;
		const { type, postId, profilePicture } = req.body;

		const reactionData: IReactionDocument = { username, avatarColor, type, postId, profilePicture } as IReactionDocument;

		const reactions = await reactionCache.addReactionToCache(reactionData);

		reactionQueue.addReactionJob('addReactionToDB', { reactionData, reactions });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Add reactions successfully', reactions });
	}

	@joiValidation(udpateReactionSchema)
	public async update(req: Request, res: Response): Promise<void> {
		const { username, avatarColor } = req.currentUser!;
		const { type, postId } = req.body;

		const prevReactionData = await reactionCache.getReactionDataFromCache(postId, username);
		if (!prevReactionData) throw new ServerError('No previous reaction was found. Please try again');

		const { profilePicture } = prevReactionData;
		const reactionData: IReactionDocument = { username, avatarColor, type, postId, profilePicture } as IReactionDocument;

		const reactions = await reactionCache.changeReactionToCache(reactionData, prevReactionData);

		reactionQueue.addReactionJob('updateReactionToDB', { reactionData, reactions });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Update reactions successfully', reactions });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const { username } = req.currentUser!;
		const { postId } = req.params;

		const reactionData = await reactionCache.getReactionDataFromCache(postId, username);
		if (!reactionData) throw new ServerError('No previous reaction was found. Please try again');

		const reactions = await reactionCache.deleteReactionToCache(reactionData);

		reactionQueue.addReactionJob('deleteReactionFromDB', { reactionData, reactions });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'delete reactions successfully', reactions });
	}
}