import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { InferAttributes } from 'sequelize';

import { Ma } from '@stock/models/ma.schema';
import { maService } from '@service/mysql/ma.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { createMaSchema } from '@stock/schemes/add-ma';

export class MaAdder {
	@joiValidation(createMaSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { ma, maBy, breakRatio, color, isAbove, TickId, indicatorType } = req.body;

		const data: InferAttributes<Ma> = { ma: +ma, TickId, maBy, breakRatio, color, isAbove, indicatorType };

		await maService.createMa(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}
}
