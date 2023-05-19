import { Document } from 'mongoose';

import { BaseCache } from '@service/redis/base.cache';

class RedisConnection extends BaseCache<Document> {
	constructor() {
		super('Redis Connection');
	}

	public async connect(): Promise<void> {
		await this.client.connect();
	}
}

export const redisConnection = new RedisConnection();
