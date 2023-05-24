import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { stockService } from '@service/mysql/stock.service';
import { BadRequestError } from '@global/helpers/error-handler';

export class StockFetcher {
	public async read(req: Request, res: Response): Promise<void> {
		const result = await stockService.getHistoricalData();
		const data = JSON.stringify(result, null, 2);

		res.status(HTTP_STATUS.OK).json({ message: 'Get historical data successfully.', data });
	}

	public async readByMonth(req: Request, res: Response): Promise<void> {
		const { selectedMonth } = req.params;

		if (!selectedMonth) throw new BadRequestError('Invalid month');

		const selectedDate = new Date();

		const startMonth = selectedDate.getMonth() - parseInt(selectedMonth);
		selectedDate.setMonth(startMonth);

		const result = await stockService.getDataByDate(selectedDate);
		const data = JSON.stringify(result, null, 2);
		console.log(data);
		res.status(HTTP_STATUS.OK).json({ message: `Get ${selectedMonth} month(s) data successfully`, data });
	}
}
