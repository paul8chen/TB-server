import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { InferAttributes } from 'sequelize';

import { tickService } from '@service/mysql/tick.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { Tick } from '@stock/models/tick.schema';
import { createTickSchema, readTickSchema } from '@stock/schemes/tick.scheme';
import { priceService } from '@service/mysql/price.service';
import { maService } from '@service/mysql/ma.service';

export class TickController {
	@joiValidation(createTickSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { tickName, totalIndicator, uId } = req.body;

		const data: InferAttributes<Tick> = { tickName, totalIndicator, uId };
		const tickData = await tickService.createTick(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add tick successfully.', data: { tickData } });
	}

	@joiValidation(readTickSchema)
	public async read(req: Request, res: Response): Promise<void> {
		const { uId } = req.body;
		console.log('uId: ', uId);

		const tickData = await tickService.getTickByUserId(uId as string);

		res.status(HTTP_STATUS.OK).json({ message: 'Get tick successfully.', data: { tickData } });
	}

	public async readIndicator(req: Request, res: Response): Promise<void> {
		const { tickId } = req.params;
		console.log('tickId: ', tickId);
		const getPriceDataQuery = priceService.getPriceByTickId(tickId);
		const getMaDataQuery = maService.getMaByTickId(tickId);

		const [priceData, maData] = await Promise.all([getPriceDataQuery, getMaDataQuery]);
		const indicatorData = [...priceData, ...maData];

		res.status(HTTP_STATUS.OK).json({ message: 'Get tick successfully.', data: { indicatorData } });
	}

	public async delete(req: Request, res: Response): Promise<void> {
		// const { tick, TickCartId } = req.body;

		// await tickService.deleteTickByTickNameAndTickCartId(tick, TickCartId);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete tick successfully.' });
	}
}
