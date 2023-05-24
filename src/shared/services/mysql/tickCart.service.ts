import { InferAttributes, Op } from 'sequelize';

import { BaseService } from './base.service';
import { TickCart } from '@stock/models/tickCart.schema';

class TickCartService extends BaseService<typeof TickCart> {
	service = TickCart;

	constructor() {
		super('tickCart');
	}
	public async createCart(data: InferAttributes<TickCart>): Promise<TickCart> {
		return await this.service.create(data);
	}

	public async deleteCart(data: InferAttributes<TickCart>): Promise<void> {
		const { userId, cartName } = data;
		await this.service.destroy({ where: { [Op.and]: [{ userId }, { cartName }] } });
	}
}

export const tickCartService = new TickCartService();
