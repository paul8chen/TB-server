import { RedisClientType } from 'redis';
import Logger from 'bunyan';

import { ServerError } from '@global/helpers/error-handler';

interface Cache {
	client: RedisClientType;
	log: Logger;
}

export function withCacheOpen<T extends Cache>(target: T): T {
	return new Proxy(target, {
		get: (obj: Cache, prop: keyof Cache) => {
			try {
				if (!obj.client.isOpen) {
					obj.client.connect();
					obj.log.info('Cache reconnected.');
				}
				return obj[prop];
			} catch (err) {
				obj.log.error('Cache lost connection.');
				throw new ServerError('Server error. Try again.');
			}
		}
	}) as T;
}

// export class WithCacheOpen<T> {
// 	open() {
// 		return (target: T) =>
// 			new Proxy(target, {
// 				get: (obj: Cache, prop: keyof Cache) => {
// 					try {
// 						if (!obj.client.isOpen) {
// 							obj.client.connect();
// 						}
// 						return obj[prop];
// 					} catch (err) {
// 						obj.log.error('Cache lost connection.');
// 						throw new ServerError('Server error. Try again.');
// 					}
// 				}
// 			});
// 	}
// }
