import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { maService } from '@service/mysql/ma.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { addMaSchema } from '@stock/schemes/add-ma';

export class MaAdder {
	@joiValidation(addMaSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { param, tickId } = req.body;

		const userId = req.currentUser!.userId;

		const data = { param: +param, tickId };
		await maService.createMa(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Set MA successfully.', user: userId });
	}
}
