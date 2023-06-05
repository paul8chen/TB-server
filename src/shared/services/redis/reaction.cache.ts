import { WatchError, RedisFunctions, RedisModules, RedisScripts } from 'redis';

import { BaseCache, SerializedData } from '@service/redis/base.cache';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/Helpers';
import { ServerError } from '@global/helpers/error-handler';
import { RedisClientMultiCommandType } from 'node_modules/@redis/client/dist/lib/client/multi-command';
import { config } from '@root/config';

type CacheExecutionType = (reactions: IReactions, multi: RedisClientMultiCommandType<RedisModules, RedisFunctions, RedisScripts>) => void;

export class ReactionCache extends BaseCache<IReactionDocument> {
	constructor() {
		super('Reaction-Cache');
	}

	public async addReactionToCache(reactionData: IReactionDocument): Promise<IReactions> {
		const { postId, type } = reactionData;

		const addReactionExecution: CacheExecutionType = (reactions, multi) => {
			reactions[type]++;
			multi.hSet(`posts:${postId}`, { reactions: JSON.stringify(reactions) });
			multi.lPush(`reactions:${postId}`, JSON.stringify(reactionData));
		};

		return await this.updateReactionsInCacheWithWatch(postId, addReactionExecution);
	}

	public async changeReactionToCache(reactionData: IReactionDocument, prevReactionData: IReactionDocument): Promise<IReactions> {
		const { postId, type } = reactionData;
		const { type: prevType } = prevReactionData;

		const changeReactionExecution: CacheExecutionType = (reactions, multi) => {
			reactions[type]++;
			reactions[prevType]--;
			multi.hSet(`posts:${postId}`, { reactions: JSON.stringify(reactions) });
			multi.lRem(`reactions:${postId}`, 1, JSON.stringify(prevReactionData));
			multi.lPush(`reactions:${postId}`, JSON.stringify(reactionData));
		};

		return await this.updateReactionsInCacheWithWatch(postId, changeReactionExecution);
	}

	public async deleteReactionToCache(reactionData: IReactionDocument): Promise<IReactions> {
		const { postId, type } = reactionData;

		const deleteReactionExecution: CacheExecutionType = (reactions, multi) => {
			reactions[type]--;
			multi.hSet(`posts:${postId}`, { reactions: JSON.stringify(reactions) });
			multi.lRem(`reactions:${postId}`, 1, JSON.stringify(reactionData));
		};

		return await this.updateReactionsInCacheWithWatch(postId, deleteReactionExecution);
	}

	private async updateReactionsInCacheWithWatch(postId: string, cacheExecution: CacheExecutionType): Promise<IReactions> {
		const retryDelayMs = +config.REDIS_RETRY_DELAY_MS;
		let retry = +config.REDIS_RETRY;

		while (retry > 0) {
			retry--;

			try {
				return await this.client.executeIsolated(async (isolatedClient) => {
					await isolatedClient.watch(`posts:${postId}`);

					const reactionsFromCache = await isolatedClient.hGet(`posts:${postId}`, 'reactions');
					if (!reactionsFromCache) throw new ServerError('Post is missing. Please try again');

					const reactions = JSON.parse(reactionsFromCache);
					const multi = isolatedClient.multi();
					cacheExecution(reactions, multi);

					await multi.exec();

					return reactions;
				});
			} catch (err) {
				if (!(err instanceof WatchError)) {
					throw new ServerError('Update reaction failed.');
				}
				await Helpers.pause(retryDelayMs);
				continue;
			}
		}

		throw new ServerError('Update reaction failed. Please try again.');
	}

	public async getReactionDataFromCache(postId: string, username: string): Promise<IReactionDocument | undefined> {
		const reactionDatas = await this.client.lRange(`reactions:${postId}`, 0, -1);

		const matchedReactionData = reactionDatas.find((reactionData) => {
			const reaction: IReactionDocument = JSON.parse(reactionData);
			return reaction.username === username;
		});

		if (!matchedReactionData) return;

		return JSON.parse(matchedReactionData) as IReactionDocument;
	}

	public async getAllReactionDataFromCache(postId: string): Promise<IReactionDocument[]> {
		const serializedReactionDatas = await this.client.lRange(`reactions:${postId}`, 0, -1);

		const reactionDatas: IReactionDocument[] = [];

		serializedReactionDatas.forEach((serializedReactionData) => {
			const reactionData: IReactionDocument = JSON.parse(serializedReactionData);

			reactionDatas.push(reactionData);
		});

		return reactionDatas;
	}
}
