import { InferAttributes, Op } from 'sequelize';

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

	public async deleteTickByTickNameAndTickCartId(tick: string, TickCartId: string): Promise<void> {
		await Tick.destroy({ where: { [Op.and]: [{ tick }, { TickCartId }] } });
	}
}

export const tickService = new TickService();
