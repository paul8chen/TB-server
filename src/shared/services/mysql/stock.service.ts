import { Op, InferAttributes } from 'sequelize';
import { Stock } from '@stock/models/stock.schema';
import { BaseService } from './base.service';

class StockService extends BaseService<typeof Stock> {
	service = Stock;

	constructor() {
		super('stock');
	}

	public async createHistoricalData(data: InferAttributes<Stock>): Promise<void> {
		await this.service.create(data);
	}

	public async getHistoricalData(): Promise<Stock[]> {
		const data = await this.service.findAll({
			attributes: ['date', 'open', 'close', 'low', 'high']
		});

		return data;
	}

	public async getDataByDate(date: Date): Promise<Stock[]> {
		const data = await this.service.findAll({
			attributes: ['date', 'open', 'close', 'low', 'high'],
			where: {
				date: { [Op.gte]: date }
			}
		});

		return data;
	}
}

export const stockService = new StockService();
