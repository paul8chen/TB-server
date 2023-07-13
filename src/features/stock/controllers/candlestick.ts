import { Request, Response } from 'express';
import { InferAttributes } from 'sequelize';
import HTTP_STATUS from 'http-status-codes';

import { Candlestick } from '@stock/models/candlestick.schema';
import { candlestickService } from '@service/mysql/candlestick.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { deleteByIdSchema } from '@stock/schemes/add-price';
import { createCandlestickSchema, updateCandlestickSchema } from '@stock/schemes/candlestick.schema';
import { IUpdateCandlestickDocument } from '@stock/interfaces/stock.interface';

export class CandlestickController {
	@joiValidation(createCandlestickSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { bodyRatio, upperShadow, lowerShadow, candlestickType, TickId, indicatorType } = req.body;

		const data: InferAttributes<Candlestick> = {
			bodyRatio: +bodyRatio,
			upperShadow: +upperShadow,
			lowerShadow: +lowerShadow,
			candlestickType,
			TickId,
			indicatorType
		};
		console.log('DATA: ', data);
		await candlestickService.createCandlestick(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add candlestick successfully.' });
	}

	@joiValidation(updateCandlestickSchema)
	public async update(req: Request, res: Response): Promise<void | Response> {
		const { id, bodyRatio, upperShadow, lowerShadow, candlestickType } = req.body;

		const data: IUpdateCandlestickDocument = {
			bodyRatio: +bodyRatio,
			upperShadow: +upperShadow,
			lowerShadow: +lowerShadow,
			candlestickType
		};

		await candlestickService.updateCandlestickById(id, data);

		res.status(HTTP_STATUS.OK).json({ message: 'Update candlestick successfully.' });
	}

	@joiValidation(deleteByIdSchema)
	public async delete(req: Request, res: Response): Promise<void | Response> {
		const { id, tickId } = req.body;

		await candlestickService.deleteCandlestickById(id, tickId);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete candlestick successfully.' });
	}
}
