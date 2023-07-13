import { InferAttributes } from 'sequelize';

import { BaseService } from './base.service';
import { Tick } from '@stock/models/tick.schema';
import { Candlestick } from '@stock/models/candlestick.schema';
import { IUpdateCandlestickDocument } from '@stock/interfaces/stock.interface';

class CandlestickService extends BaseService<typeof Candlestick> {
	service = Candlestick;

	constructor() {
		super('candlestick');
	}
	public async createCandlestick(data: InferAttributes<Candlestick>): Promise<void> {
		await Promise.all([Candlestick.create(data), Tick.increment({ totalIndicator: 1 }, { where: { id: data.TickId } })]);
	}

	public async getCandlestickByTickId(TickId: string): Promise<InferAttributes<Candlestick>[]> {
		return Candlestick.findAll({
			attributes: ['id', 'bodyRatio', 'upperShadow', 'lowerShadow', 'candlestickType', 'indicatorType', 'createdAt'],
			where: { TickId }
		});
	}

	public async updateCandlestickById(id: string, data: IUpdateCandlestickDocument): Promise<void> {
		await Candlestick.update(data, {
			where: { id }
		});
	}

	public async deleteCandlestickById(id: string, tickId: string): Promise<void> {
		await Promise.all([Candlestick.destroy({ where: { id } }), Tick.increment({ totalIndicator: 1 }, { where: { id: tickId } })]);
	}
}

export const candlestickService = new CandlestickService();
