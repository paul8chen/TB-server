import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { priceService } from '@service/mysql/price.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BaseScheme } from '@global/schemes/base.scheme';

const createPriceScheme = new BaseScheme('PRICE').stringOption('TickId').numberOption('price').createScheme();
const udpatePriceScheme = new BaseScheme('PRICE').stringOption('TickId').numberOption('price', 'newPrice').createScheme();

export class PriceController {
	@joiValidation(createPriceScheme)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { price, TickId } = req.body;

		const data = { price: +price, TickId };
		await priceService.createPrice(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}

	@joiValidation(udpatePriceScheme)
	public async update(req: Request, res: Response): Promise<void | Response> {
		const { price, newPrice, TickId } = req.body;

		const data = { price: +price, newPrice: +newPrice, TickId };
		await priceService.updatePriceById(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Update price successfully.' });
	}

	@joiValidation(createPriceScheme)
	public async delete(req: Request, res: Response): Promise<void | Response> {
		const { price, TickId } = req.body;

		const data = { price: +price, TickId };
		await priceService.deletePriceByPriceAndTickId(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete price successfully.' });
	}
}
