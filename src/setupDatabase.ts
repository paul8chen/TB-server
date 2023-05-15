import mongoose from 'mongoose';

import { config } from './config';

const log = config.createLogger('database');

mongoose.connection.once('open', () => {
	log.info('Connect to database successfully.');
});

mongoose.connection.on('error', (err) => {
	log.error('Failed to Connect to database.', err);
	return process.exit(1);
});

export default async () => {
	const connect = async () => {
		await mongoose.connect(config.DATABASE_URL);
	};

	await connect();

	mongoose.connection.on('disconnected', async () => {
		await connect();
	});
};
