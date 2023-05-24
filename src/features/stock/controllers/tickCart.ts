import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { tickCartService } from '@service/mysql/tickCart.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BaseScheme } from '@global/schemes/base.scheme';

const createTickCartScheme = new BaseScheme('TICKCART').stringOption('cartName').createScheme();

export class TickCartController {
	@joiValidation(createTickCartScheme)
	public async create(req: Request, res: Response): Promise<void> {
		const { cartName } = req.body;

		const userId = req.currentUser!.userId;

		const data = { userId, cartName };
		const { id } = await tickCartService.createCart(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add tickCart successfully.', data: { id, ...data } });
	}

	@joiValidation(createTickCartScheme)
	public async delete(req: Request, res: Response): Promise<void> {
		const { cartName } = req.body;

		const userId = req.currentUser!.userId;

		const data = { userId, cartName };
		await tickCartService.deleteCart(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete tickCart successfully.', data });
	}
}
