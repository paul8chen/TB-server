import { Sequelize } from 'sequelize';

import { config } from '@root/config';

const log = config.createLogger('MYSQL');

class MysqlConnection {
	public sequelize: Sequelize;

	constructor() {
		this.sequelize = new Sequelize(config.MYSQL_DATABASENAME, config.MYSQL_USERNAME, config.MYSQL_PASSWORD, {
			host: config.MYSQL_HOST,
			port: +config.MYSQL_PORT,
			dialect: 'mysql'
		});
	}
	public async connect(): Promise<void> {
		try {
			await this.sequelize.authenticate();
			log.info('Connect to MYSQL successfully.');
		} catch (err) {
			console.log(err);
			log.error('Connect to MYSQL failed.');
		}
	}

	public async init(): Promise<void> {
		try {
			await this.sequelize.drop();
			log.info('Initiate database.');
		} catch (err) {
			log.error('Failed to Initiate database.');
		}
	}
}

export const mysqlConnection = new MysqlConnection();
