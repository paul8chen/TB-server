import { omit } from 'lodash';
import { ObjectId } from 'mongoose';

import { ServerError } from '@global/helpers/error-handler';
import { BaseCache } from '@service/redis/base.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { config } from '@root/config';

const log = config.createLogger('userCache');

export class UserCache extends BaseCache<IUserDocument> {
	constructor() {
		super('userCache');
	}

	public async saveUserToCache(userId: string, userUid: string, createdUser: IUserDocument): Promise<void> {
		const createdAt = new Date();
		const dataToSave = omit({ ...createdUser, createdAt }, ['authId']) as IUserDocument;
		const serializedData = this.serialize(dataToSave);

		try {
			if (!this.client.isOpen) await this.client.connect();

			await this.client.zAdd('user', { score: parseInt(userUid, 10), value: `${userId}` });
			await this.client.hSet(`users:${userId}`, serializedData);
		} catch (err) {
			log.error(err);
			throw new ServerError(`${this.cacheName} cache failed.`);
		}
	}

	public async getUserFromCache(userId: string | ObjectId): Promise<IUserDocument | void> {
		try {
			if (!this.client.isOpen) await this.client.connect();

			const dataFromCache = await this.client.hGetAll(`users:${userId}`);

			if (Object.keys(dataFromCache).length === 0) return;

			const deserializedData = this.deserialize(dataFromCache);

			deserializedData.createdAt &&= new Date(deserializedData.createdAt);
			deserializedData.postsCount &&= parseInt(deserializedData.postsCount, 10);
			deserializedData.followersCount &&= parseInt(deserializedData.followersCount, 10);
			deserializedData.followingCount &&= parseInt(deserializedData.followingCount, 10);

			return deserializedData as IUserDocument;
		} catch (err) {
			log.error(err);
			throw new ServerError(`${this.cacheName} cache failed.`);
		}
	}
}
