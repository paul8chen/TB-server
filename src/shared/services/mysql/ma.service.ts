import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Ma } from '@stock/models/ma.schema';
import { Tick } from '@stock/models/tick.schema';
import { IUpdateMaDocument } from '@stock/interfaces/stock.interface';

class MaService extends BaseService<typeof Ma> {
	service = Ma;
	constructor() {
		super('Ma');
	}
	public async createMa(data: InferAttributes<Ma>): Promise<void> {
		await Promise.all([this.service.create(data), Tick.increment({ totalIndicator: 1 }, { where: { id: data.TickId } })]);
	}

	public async getMaByTickId(TickId: string): Promise<InferAttributes<Ma>[]> {
		return Ma.findAll({
			attributes: ['id', 'ma', 'maBy', 'color', 'breakRatio', 'isAbove', 'indicatorType', 'createdAt'],
			where: { TickId }
		});
	}

	public async updateMaById(id: string, data: IUpdateMaDocument): Promise<void> {
		await Ma.update(data, {
			where: { id }
		});
	}

	public async deleteMaById(id: string, tickId: string): Promise<void> {
		await Promise.all([Ma.destroy({ where: { id } }), Tick.increment({ totalIndicator: 1 }, { where: { id: tickId } })]);
	}
}

export const maService = new MaService();
