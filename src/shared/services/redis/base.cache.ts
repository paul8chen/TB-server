import { Document } from 'mongoose';
import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts, WatchError } from 'redis';
import Logger from 'bunyan';

import { RedisClientMultiCommandType } from 'node_modules/@redis/client/dist/lib/client/multi-command';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/Helpers';

export type SerializedData = { [key: string]: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeserializedData = { [key: string]: any };

export let redisClient: RedisClientType;

export abstract class BaseCache<T extends Document> {
	public client: RedisClientType;
	public log: Logger;

	constructor(public cacheName: string) {
		this.client = createClient({ url: config.REDIS_HOST });
		this.log = config.createLogger(cacheName);
		this.cacheConnect();
		this.cacheError();
		redisClient = this.client;
	}

	private cacheError(): void {
		this.client.on('error', (err: unknown) => {
			this.log.error(`${this.cacheName} error:${err}`);
		});
	}

	private cacheConnect(): void {
		this.client.on('connect', () => {
			this.log.info(`Connect to ${this.cacheName} cache successfully.`);
		});
	}

	protected serialize(data: T): SerializedData {
		const serializedData: SerializedData = {};
		for (const [key, value] of Object.entries(data)) {
			if (value instanceof Object) {
				serializedData[key] = JSON.stringify(value);
			} else {
				serializedData[key] = `${value}`;
			}
		}

		return serializedData;
	}

	protected deserialize(data: SerializedData): DeserializedData {
		const deserializedData: DeserializedData = {};
		for (const [key, value] of Object.entries(data)) {
			try {
				deserializedData[key] = JSON.parse(value);
			} catch (err) {
				deserializedData[key] = value;
			}
		}

		return deserializedData;
	}
}
