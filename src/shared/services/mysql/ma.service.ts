import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Ma } from '@stock/models/ma.schema';

class MaService extends BaseService<typeof Ma> {
	service = Ma;
	constructor() {
		super('Ma');
	}
	public async createMa(data: InferAttributes<Ma>): Promise<void> {
		await this.service.create(data);
	}
}

export const maService = new MaService();
