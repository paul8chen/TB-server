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
					const { Open, Close, Low, High, Date: date, Volume } = data;
					const highP = +Close >= +Open ? +Close : +Open;
					const lowP = +Close >= +Open ? +Open : +Close;

					const storedData: InferAttributes<Stock> = {
						date: new Date(date),
						open: +Open,
						close: +Close,
						low: +Low,
						high: +High,
						highP,
						lowP,
						volume: +Volume
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
