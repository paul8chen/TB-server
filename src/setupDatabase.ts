import mongoose from 'mongoose';

import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';
import { mysqlConnection } from '@service/mysql/mysql.connection';
import { stockService } from '@service/mysql/stock.service';
import { priceService } from '@service/mysql/price.service';
import { maService } from '@service/mysql/ma.service';
import { tickService } from '@service/mysql/tick.service';
import { tickCartService } from '@service/mysql/tickCart.service';

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
		await mysqlConnection.connect();
		// await mysqlConnection.init();
		await redisConnection.connect();

		// await mysqlConnection.sequelize.sync({ force: true });
		// await tickCartService.syncTable();
		await tickService.syncTable();
		await Promise.all([stockService.syncTable(), priceService.syncTable(), maService.syncTable()]);
	};

	await connect();

	mongoose.connection.on('disconnected', async () => {
		await connect();
	});
};
