import { Request, Response } from 'express';
import { InferAttributes } from 'sequelize';
import HTTP_STATUS from 'http-status-codes';

import { Price } from '@stock/models/price.schema';
import { priceService } from '@service/mysql/price.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { createPriceSchema, updatePriceSchema, deleteByIdSchema } from '@stock/schemes/add-price';
import { IUpdatePriceDocument } from '@stock/interfaces/stock.interface';

export class PriceController {
	@joiValidation(createPriceSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { price, date, breakRatio, color, isAbove, TickId, indicatorType } = req.body;

		const data: InferAttributes<Price> = { price: +price, TickId, date, breakRatio, color, isAbove, indicatorType };

		await priceService.createPrice(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}

	@joiValidation(updatePriceSchema)
	public async update(req: Request, res: Response): Promise<void | Response> {
		const { id, price, date, breakRatio, color, isAbove } = req.body;

		const data: IUpdatePriceDocument = { price: +price, date, breakRatio, color, isAbove };

		await priceService.updatePriceById(id, data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}

	@joiValidation(deleteByIdSchema)
	public async delete(req: Request, res: Response): Promise<void | Response> {
		const { id, tickId } = req.body;

		await priceService.deletePriceById(id, tickId);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete price successfully.' });
	}
}
