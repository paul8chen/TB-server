import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { tickService } from '@service/mysql/tick.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BaseScheme } from '@global/schemes/base.scheme';

const createTickScheme = new BaseScheme('TICK')
	.stringOption('tick', 'TickCartId')
	.numberOption('open', 'close', 'low', 'high')
	.createScheme();

const deleteTickScheme = new BaseScheme('TICK').stringOption('tick', 'TickCartId').createScheme();

export class TickController {
	@joiValidation(createTickScheme)
	public async create(req: Request, res: Response): Promise<void> {
		const { open, close, low, high, tick, TickCartId } = req.body;

		const data = { open: +open, close: +close, low: +low, high: +high, tick, TickCartId };
		const { id } = await tickService.createTick(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add tick successfully.', data: { id, ...data } });
	}

	@joiValidation(deleteTickScheme)
	public async delete(req: Request, res: Response): Promise<void> {
		const { tick, TickCartId } = req.body;

		await tickService.deleteTickByTickNameAndTickCartId(tick, TickCartId);

		res.status(HTTP_STATUS.OK).json({ message: `Delete tick ${tick} successfully.` });
	}
}
