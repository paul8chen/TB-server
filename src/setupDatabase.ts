import mongoose from 'mongoose';

import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';

const log = config.createLogger('database');

mongoose.connection.once('open', () => {
	log.info('Connect to database successfully.');
});

mongoose.connection.on('error', (err: unknown) => {
	log.error('Failed to Connect to database.', err);
	return process.exit(1);
});

export default async () => {
	const connect = async () => {
		await mongoose.connect(config.DATABASE_URL);
		await redisConnection.connect();
	};

	await connect();

	mongoose.connection.on('disconnected', async () => {
		await connect();
	});
};
