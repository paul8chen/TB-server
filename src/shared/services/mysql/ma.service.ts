import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Ma } from '@stock/models/ma.schema';
import { Tick } from '@stock/models/tick.schema';

class MaService extends BaseService<typeof Ma> {
	service = Ma;
	constructor() {
		super('Ma');
	}
	public async createMa(data: InferAttributes<Ma>): Promise<void> {
		await Promise.all([this.service.create(data), Tick.increment({ totalIndicator: 1 }, { where: { id: data.TickId } })]);
	}

	public async getMaByTickId(TickId: string): Promise<InferAttributes<Ma>[]> {
		return Ma.findAll({ attributes: ['id', 'ma', 'maBy', 'color', 'breakRatio', 'isAbove'], where: { TickId } });
	}
}

export const maService = new MaService();
