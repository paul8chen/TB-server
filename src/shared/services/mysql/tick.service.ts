import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Tick } from '@stock/models/tick.schema';

class TickService extends BaseService<typeof Tick> {
	service = Tick;

	constructor() {
		super('tick');
	}
	public async createTick(data: InferAttributes<Tick>): Promise<Tick> {
		return await Tick.create(data);
	}

	public async getTickByUserId(uId: string): Promise<Tick[]> {
		return await Tick.findAll({ attributes: ['id', 'tickName', 'totalIndicator'], where: { uId } });
	}

	public async deleteTickByTickId(id: string): Promise<void> {
		await Tick.destroy({ where: { id } });
	}
}

export const tickService = new TickService();
