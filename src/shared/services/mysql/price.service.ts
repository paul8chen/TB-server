import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Tick } from '@stock/models/tick.schema';
import { Price } from '@stock/models/price.schema';
import { IUpdatePriceDocument } from '@stock/interfaces/stock.interface';

class PriceService extends BaseService<typeof Price> {
	service = Price;

	constructor() {
		super('price');
	}
	public async createPrice(data: InferAttributes<Price>): Promise<void> {
		await Promise.all([Price.create(data), Tick.increment({ totalIndicator: 1 }, { where: { id: data.TickId } })]);
	}

	public async getPriceByTickId(TickId: string): Promise<InferAttributes<Price>[]> {
		return Price.findAll({
			attributes: ['id', 'price', 'date', 'color', 'breakRatio', 'isAbove', 'indicatorType', 'createdAt'],
			where: { TickId }
		});
	}

	public async updatePriceById(id: string, data: IUpdatePriceDocument): Promise<void> {
		await Price.update(data, {
			where: { id }
		});
	}

	public async deletePriceById(id: string, tickId: string): Promise<void> {
		await Promise.all([Price.destroy({ where: { id } }), Tick.increment({ totalIndicator: 1 }, { where: { id: tickId } })]);
	}
}

export const priceService = new PriceService();
