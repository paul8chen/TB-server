import { Request, Response } from 'express';
import { InferAttributes } from 'sequelize';
import HTTP_STATUS from 'http-status-codes';

import { Price } from '@stock/models/price.schema';
import { priceService } from '@service/mysql/price.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { createPriceSchema } from '@stock/schemes/add-price';

export class PriceController {
	@joiValidation(createPriceSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { price, date, breakRatio, color, isAbove, TickId, indicatorType } = req.body;

		const data: InferAttributes<Price> = { price: +price, TickId, date, breakRatio, color, isAbove, indicatorType };
		console.log('data: ', data);
		await priceService.createPrice(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}

	public async update(req: Request, res: Response): Promise<void | Response> {
		const { price, newPrice, TickId } = req.body;

		const data = { price: +price, newPrice: +newPrice, TickId };
		await priceService.updatePriceById(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Update price successfully.' });
	}

	public async delete(req: Request, res: Response): Promise<void | Response> {
		// const { price, TickId } = req.body;

		// const data = { price: +price, TickId };
		// await priceService.deletePriceByPriceAndTickId(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete price successfully.' });
	}
}
