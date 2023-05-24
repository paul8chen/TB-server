import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
import { InferAttributes } from 'sequelize';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { Stock } from '@stock/models/stock.schema';
import { stockService } from '@service/mysql/stock.service';

export class StockLoader {
	public async create(req: Request, res: Response): Promise<void> {
		await StockLoader.prototype.loadData();

		res.status(HTTP_STATUS.OK).json({ message: 'Load stock data to database successfully.' });
	}

	private loadData(): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.createReadStream(path.join(__dirname, '..', '..', '..', '..', 'data', 'BTCUSDT.csv'))
				.pipe(
					parse({
						columns: true
					})
				)
				.on('data', async (data) => {
					const storedData: InferAttributes<Stock> = {
						date: new Date(data.Date),
						open: +data.Open,
						close: +data.Close,
						low: +data.Low,
						high: +data.High,
						volume: +data.Volume
					};

					await stockService.createHistoricalData(storedData);
					console.log('Done', storedData);
				})
				.on('error', (err) => {
					console.log(err);
					reject(err);
				})
				.on('end', async () => {
					console.log('Data parsing completed.');
					resolve();
				});
		});
	}
}
