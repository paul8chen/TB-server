import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { InferAttributes } from 'sequelize';

import { Ma } from '@stock/models/ma.schema';
import { maService } from '@service/mysql/ma.service';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { createMaSchema, updateMaSchema } from '@stock/schemes/add-ma';
import { deleteByIdSchema } from '@stock/schemes/add-price';
import { IUpdateMaDocument } from '@stock/interfaces/stock.interface';

export class MaAdder {
	@joiValidation(createMaSchema)
	public async create(req: Request, res: Response): Promise<void | Response> {
		const { ma, maBy, breakRatio, color, isAbove, TickId, indicatorType } = req.body;

		const data: InferAttributes<Ma> = { ma: +ma, TickId, maBy, breakRatio, color, isAbove, indicatorType };

		await maService.createMa(data);

		res.status(HTTP_STATUS.OK).json({ message: 'Add price successfully.' });
	}

	@joiValidation(updateMaSchema)
	public async update(req: Request, res: Response): Promise<void | Response> {
		const { id, ma, maBy, breakRatio, color, isAbove } = req.body;

		const data: IUpdateMaDocument = { ma: +ma, maBy, breakRatio, color, isAbove };

		await maService.updateMaById(id, data);

		res.status(HTTP_STATUS.OK).json({ message: 'Update MA successfully.' });
	}

	@joiValidation(deleteByIdSchema)
	public async delete(req: Request, res: Response): Promise<void | Response> {
		const { id, tickId } = req.body;

		await maService.deleteMaById(id, tickId);

		res.status(HTTP_STATUS.OK).json({ message: 'Delete MA successfully.' });
	}
}
