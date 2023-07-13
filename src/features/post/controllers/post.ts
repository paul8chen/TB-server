import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { postSchema } from '@post/schemes/post.schemes';
import { config } from '@root/config';
import { withCacheOpen } from '@global/helpers/cacheOpen';
import { IPostDocument } from '@post/interfaces/post.interface';
import { IReactions } from '@reaction/interfaces/reaction.interface';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { PostCache } from '@service/redis/post.cache';
import { postSocketIO } from '@root/shared/sockets/post.socket';
import { postQueue } from '@service/queues/post.queue';
import { postService } from '@service/db/post.service';

const postCache = withCacheOpen(new PostCache());

export class Post {
	@joiValidation(postSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { post, profilePicture, image } = req.body;
		const { uId, userId, username, email } = req.currentUser!;
		const reactions: IReactions = { rocket: 0, bullish: 0, bearish: 0 };

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
			profilePicture,
			post,
			commentsCount: 0,
			imgVersion: imgVersion || '',
			imgId: imgId || '',
			createdAt: new Date(),
			reactions
		} as IPostDocument;

		const cacheData = { key: postObjectId, currentUserId: userId, uId, createdPost };

		await postCache.savePostToCache(cacheData);

		postSocketIO.emit('addPost', createdPost);

		const jobData = { key: userId, value: createdPost };
		postQueue.addPostJob('addPostToDB', jobData);

		res.status(HTTP_STATUS.OK).json({ statuse: 'success', message: 'Create post successfully.' });
	}

	public async read(req: Request, res: Response): Promise<void | Response> {
		const page = +req.params.page;
		const postPerPage = +config.BASE_PAGE_LIMIT;
		const skip = (page - 1) * postPerPage;
		const limit = page * postPerPage;

		let posts: IPostDocument[];
		let postsCount: number;

		posts = await postCache.getPostFromCache(skip, limit - 1);

		if (posts.length) {
			postsCount = await postCache.getTotalPostsFromCache();

			return res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all posts successed.', data: { posts, postsCount } });
		}

		posts = await postService.getPosts({}, skip, limit);
		postsCount = await postService.getPostsCount({});
		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get all posts successed.', data: { posts, postsCount } });
	}

	@joiValidation(postSchema)
	public async update(req: Request, res: Response): Promise<void> {
		const { postId } = req.params;
		const { post, profilePicture, commentsCount, image } = req.body;
		const { userId, username, email } = req.currentUser!;

		const updateData = {
			userId,
			username,
			email,
			profilePicture,
			post,
			commentsCount
		} as IPostDocument;

		if (image) {
			const uploadResult = await uploads(image);
			if (!uploadResult?.public_id) throw new BadRequestError('Upload filed. Please try again.');
			updateData['imgVersion'] = '' + uploadResult.version;
			updateData['imgId'] = uploadResult.public_id;
		}

		const udpatedPost = await postCache.updatePostsToCache(postId, updateData);

		postSocketIO.emit('updatePost', udpatedPost);

		const jobData = { key: postId, value: updateData };
		postQueue.addPostJob('updatePostToDB', jobData);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Update post successfully.', data: { udpatedPost } });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		const postId: string = req.params.postId;
		const userId: string = req.currentUser!.userId;

		await postCache.deletePostsFromCache(userId, postId);

		postSocketIO.emit('deletePost', postId);

		postQueue.addPostJob('deletePostFromDB', { keyOne: userId, keyTwo: postId });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Delete post successfully.' });
	}

	public async readSingle(req: Request, res: Response): Promise<void> {
		console.log('readSingle');
		const { postId } = req.params;

		const postData = (await postCache.getSinglePostFromCache(postId)) || (await postService.getSinglePost(postId));

		if (!postData) res.status(HTTP_STATUS.BAD_REQUEST).json({ status: 'error', message: 'Post not found.' });

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get single post successed.', data: { postData } });
	}
}
