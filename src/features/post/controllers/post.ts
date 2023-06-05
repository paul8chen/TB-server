import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { postSchema } from '@post/schemes/post.schemes';
import { config } from '@root/config';
import { IPostDocument } from '@post/interfaces/post.interface';
import { IReactions } from '@reaction/interfaces/reaction.interface';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { PostCache } from '@service/redis/post.cache';
import { postSocketIO } from '@root/shared/sockets/post.socket';
import { postQueue } from '@service/queues/post.queue';
import { postService } from '@service/db/post.service';

const postCache = new PostCache();

export class Post {
	@joiValidation(postSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { post, bgColor, privacy, profilePicture, image } = req.body;
		const { uId, userId, username, email, avatarColor } = req.currentUser!;
		const reactions: IReactions = { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 };
		console.log(reactions);
		const postObjectId: ObjectId = new ObjectId();

		const uploadResult = await uploads(image);
		if (!uploadResult?.public_id) throw new BadRequestError(uploadResult!.message);
		const imgVersion = '' + uploadResult.version;
		const imgId = uploadResult.public_id;

		const createdPost = {
			_id: postObjectId,
			userId,
			username,
			email,
			avatarColor,
			profilePicture,
			post,
			bgColor,
			commentsCount: 0,
			imgVersion: imgVersion || '',
			imgId: imgId || '',
			privacy,
			createdAt: new Date(),
			reactions
		} as IPostDocument;

		const cacheData = { key: postObjectId, currentUserId: userId, uId, createdPost };

		await postCache.savePostToCache(cacheData);

		postSocketIO.emit('add post', createdPost);

		const jobData = { key: userId, value: createdPost };
		postQueue.addPostJob('addPostToDB', jobData);

		res.status(HTTP_STATUS.OK).json({ statuse: 'success', message: 'Create post successfully.' });
	}

	public async read(req: Request, res: Response): Promise<void | Response> {
		const page = +req.params.page;
		const postPerPage = +config.BASE_PAGE_LIMIT;
		const skip = (page - 1) * postPerPage;
		const limit = page * postPerPage;
		const cacheStart = skip === 0 ? skip : skip + 1;
		const cacheEnd = skip === 0 ? limit - 1 : limit;

		let posts: IPostDocument[];
		let postsCount: number;

		posts = await postCache.getPostFromCache(cacheStart, cacheEnd);

		if (posts.length) {
			postsCount = await postCache.getTotalPostsFromCache();

			return res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all message successed.', posts, postsCount });
		}

		posts = await postService.getPosts({}, skip, limit);
		postsCount = await postService.getPostsCount({});
		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all message successed.', posts, postsCount });
	}

	@joiValidation(postSchema)
	public async update(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		const { post, profilePicture, bgColor, commentsCount, privacy, image } = req.body;
		const { userId, username, email, avatarColor } = req.currentUser!;

		const updateData = {
			userId,
			username,
			email,
			avatarColor,
			profilePicture,
			post,
			bgColor,
			commentsCount,
			privacy
		} as IPostDocument;

		if (image) {
			const uploadResult = await uploads(image);
			if (!uploadResult?.public_id) throw new BadRequestError('Upload filed. Please try again.');
			updateData['imgVersion'] = '' + uploadResult.version;
			updateData['imgId'] = uploadResult.public_id;
		}

		const udpatedPost = await postCache.updatePostsToCache(postId, updateData);

		postSocketIO.emit('post post', udpatedPost);

		const jobData = { key: postId, value: updateData };
		postQueue.addPostJob('updatePostToDB', jobData);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Update post successfully.', udpatedPost });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const postId: string = req.params.postId;
		const userId: string = req.currentUser!.userId;

		await postCache.deletePostsFromCache(userId, postId);

		postSocketIO.emit('delete post', postId);

		postQueue.addPostJob('deletePostFromDB', { keyOne: userId, keyTwo: postId });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Delete post successfully.' });
	}
}
