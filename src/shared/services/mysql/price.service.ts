import { InferAttributes, Op } from 'sequelize';

import { BaseService } from './base.service';
import { Tick } from '@stock/models/tick.schema';
import { Price } from '@stock/models/price.schema';
import { IUpdatePrice } from '@stock/interfaces/stock.interface';

class PriceService extends BaseService<typeof Price> {
	service = Price;

	constructor() {
		super('price');
	}
	public async createPrice(data: InferAttributes<Price>): Promise<void> {
		await Promise.all([Price.create(data), Tick.increment({ totalIndicator: 1 }, { where: { id: data.TickId } })]);
	}

	public async getPriceByTickId(TickId: string): Promise<InferAttributes<Price>[]> {
		return Price.findAll({ attributes: ['id', 'price', 'date', 'color', 'breakRatio', 'isAbove'], where: { TickId } });
	}

	public async updatePriceById(data: IUpdatePrice): Promise<void> {
		const { newPrice, price, TickId } = data;
		await Price.update(
			{ price: newPrice },
			{
				where: {
					[Op.and]: [
						{
							TickId
						},
						{
							price
						}
					]
				}
			}
		);
	}

	public async deletePriceByPriceAndTickId(data: InferAttributes<Price>): Promise<void> {
		const { price, TickId } = data;
		await Price.destroy({ where: { [Op.and]: [{ TickId }, { price }] } });
	}
}

export const priceService = new PriceService();
