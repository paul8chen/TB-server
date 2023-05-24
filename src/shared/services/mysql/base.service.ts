import Logger from 'bunyan';
import { Model, ModelStatic } from 'sequelize';

import { config } from '@root/config';

export abstract class BaseService<T extends ModelStatic<Model>> {
	protected abstract service: T;
	protected log: Logger;

	constructor(protected tableName: string) {
		this.log = config.createLogger(tableName);
	}
	public async syncTable(): Promise<void> {
		try {
			await this.service.sync({ force: true });
			this.log.info(`The table for the ${this.tableName} model created successfully.`);
		} catch (err) {
			this.log.error(`Failed to create the table for the ${this.tableName} model.`);
		}
	}
}
