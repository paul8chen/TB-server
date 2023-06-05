import { BaseCache } from './base.cache';
import { ISavePostToCache, IPostDocument } from '@post/interfaces/post.interface';
import { ServerError } from '@global/helpers/error-handler';
import { SerializedData } from '@service/redis/base.cache';
import { RedisCommandRawReply } from 'node_modules/@redis/client/dist/lib/commands';

export type PostCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | SerializedData | SerializedData[];

export class PostCache extends BaseCache<IPostDocument> {
	constructor() {
		super('postCache');
	}

	public async savePostToCache(data: ISavePostToCache): Promise<void> {
		const { key, currentUserId, uId, createdPost } = data;

		const serializedData = this.serialize(createdPost);

		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			const multi = this.client.multi();
			multi.ZADD('post', { score: parseInt(uId, 10), value: `${key}` });
			multi.hSet(`posts:${key}`, serializedData);
			multi.hIncrBy(`users:${currentUserId}`, 'postsCount', 1);
			multi.exec();
		} catch (error) {
			this.log.error(error);
			throw new ServerError('Server error. Try again.');
		}
	}

	public async getPostFromCache(start: number, end: number): Promise<IPostDocument[]> {
		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}

			const postIds = await this.client.zRange('post', start, end, { REV: true });

			const multi = this.client.multi();

			postIds.forEach((id) => multi.hGetAll(`posts:${id}`));

			// /* eslint-disable @typescript-eslint/no-explicit-any */
			const postsData: PostCacheMultiType = (await multi.exec()) as PostCacheMultiType;

			const posts: IPostDocument[] = [];
			(postsData as SerializedData[]).forEach((data: SerializedData) => {
				const deserializedData = this.deserialize(data);
				deserializedData.createdAt = new Date(deserializedData.createdAt);

				posts.push(deserializedData as IPostDocument);
			});

			return posts;
		} catch (error) {
			this.log.error(error);
			throw new ServerError('Server error. Try again.');
		}
	}

	public async getTotalPostsFromCache(): Promise<number> {
		const totalPosts = await this.client.zCard('post');

		return totalPosts;
	}

	public async getUserPostsFromCache(uId: number): Promise<IPostDocument[]> {
		const postIds = await this.client.zRange('post', uId, uId, { REV: true, BY: 'SCORE' });

		const multi = this.client.multi();
		postIds.forEach((id) => {
			multi.hGetAll(`posts:${id}`);
		});
		const postsData: PostCacheMultiType = (await multi.exec()) as PostCacheMultiType;

		const posts: IPostDocument[] = [];
		(postsData as SerializedData[]).forEach((data) => {
			const deserializedData = this.deserialize(data);
			deserializedData.createdAt = new Date(deserializedData.createdAt);

			posts.push(deserializedData as IPostDocument);
		});

		return posts;
	}

	public async getTotalUserPostsFromCache(uId: number): Promise<number> {
		const totalPosts = await this.client.zCount('post', uId, uId);

		return totalPosts;
	}

	public async deletePostsFromCache(userId: string, postId: string): Promise<void> {
		try {
			if (!this.client.isOpen) await this.client.connect();

			const multi = this.client.multi();

			multi.zRem('post', postId);
			multi.del(`posts:${postId}`);
			multi.del(`comments:${userId}`);
			multi.del(`reactions:${userId}`);
			multi.hIncrBy(`users:${userId}`, 'postsCount', -1);
			await multi.exec();
		} catch (err) {
			this.log.error(err);
			throw new ServerError('Server error. Try again.');
		}
	}

	public async updatePostsToCache(postId: string, data: IPostDocument): Promise<IPostDocument> {
		try {
			if (!this.client.isOpen) await this.client.connect();

			const { post, bgColor, privacy, imgVersion, imgId } = data;
			const updateData = {
				post: `${post}`,
				bgColor: `${bgColor}`,
				privacy: `${privacy}`,
				imgVersion: `${imgVersion}`,
				imgId: `${imgId}`
			};

			await this.client.hSet(`posts:${postId}`, updateData);

			const postDataFromCache = await this.client.hGetAll(`posts:${postId}`);
			console.log('postDataFromCache', postDataFromCache);
			const deserializedData = this.deserialize(postDataFromCache);
			deserializedData.createdAt = new Date(deserializedData.createdAt);

			return deserializedData as IPostDocument;
		} catch (err) {
			this.log.error(err);
			throw new ServerError('Server error. Try again.');
		}
	}
}
