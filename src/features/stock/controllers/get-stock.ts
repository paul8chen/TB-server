import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { stockService } from '@service/mysql/stock.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/Helpers';
import { config } from '@root/config';

export class StockFetcher {
	public async read(req: Request, res: Response): Promise<void> {
		const result = await stockService.getHistoricalData();
		const stockData = Helpers.getDeserializedStockData(result);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get historical data successfully.', data: { stockData } });
	}

	public async readByMonth(req: Request, res: Response): Promise<void> {
		const { selectedMonth } = req.params;

		if (!selectedMonth) throw new BadRequestError('Invalid month');

		const selectedDate = new Date();

		const startMonth = selectedDate.getMonth() - parseInt(selectedMonth);
		selectedDate.setMonth(startMonth);

		const result = await stockService.getDataByDate(selectedDate);

		const stockData = Helpers.getDeserializedStockData(result);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: `Get ${selectedMonth} month(s) data successfully`, data: { stockData } });
	}

	public async readPriceFiltered(req: Request, res: Response): Promise<void> {
		const { price, date, breakRatio, isAbove } = req.query;
		if (!price) throw new BadRequestError('Price is a must.');
		if (!date) throw new BadRequestError('Date is a must.');
		if (!breakRatio) throw new BadRequestError('BreakRatio is a must.');

		if (+breakRatio > 1 || +breakRatio < 0) throw new BadRequestError('Invalid breakRatio.');

		const serializedStockData =
			isAbove === 'true'
				? await stockService.getStockDataAboveByPrice(+price, date as string, +breakRatio)
				: await stockService.getStockDataBreakThroughByPrice(+price, date as string, +breakRatio);

		const filteredData = Helpers.getDeserializedChartData(serializedStockData);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: ' Filter stock data successed', data: { filteredData } });
	}

	public async readMa(req: Request, res: Response): Promise<void> {
		const selectedMonth = +req.query.selectedMonth!;
		const ma = +req.query.ma!;
		const candleRatio = +req.query.candleRatio! ?? +config.STOCK_CANDLE_RATIO;
		const maBy: string = (req.query.maBy as string) || (config.STOCK_CACULATE_MA_BY as string);
		const { isAbove } = req.query;

		if (!selectedMonth) throw new BadRequestError('Missing month');
		if (!ma) throw new BadRequestError('Missing MA');

		const selectedDate = new Date();
		const startMonth = selectedDate.getMonth() - selectedMonth;
		selectedDate.setMonth(startMonth);
		const selectedDateISO = selectedDate.toISOString();

		const getStockDataQuery =
			isAbove === 'true'
				? await stockService.getStockDataAboveByMA(selectedDateISO, ma, maBy, candleRatio)
				: await stockService.getStockDataBreakThroughByMA(selectedDateISO, ma, maBy, candleRatio);

		const [serializedMaData, serializedStockData] = await Promise.all([
			stockService.getMaData(selectedDateISO, ma, maBy),
			getStockDataQuery
		]);

		const maData = Helpers.getDeserializedChartData(serializedMaData);
		const stockData = Helpers.getDeserializedChartData(serializedStockData);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get stock data MA successed.', data: { maData, stockData } });
	}

	public async readByCandleStick(req: Request, res: Response): Promise<void | Response> {
		const upperShadowRatio: string | undefined = req.query!.upperShadowRatio as string | undefined;
		const bodyRatio: string | undefined = req.query!.bodyRatio as string | undefined;
		const candlestickType: string | undefined = req.query!.candlestickType as string | undefined;

		const { selectedMonth } = req.query!;

		if (!selectedMonth) throw new BadRequestError('Missing month');
		if (!candlestickType && !bodyRatio) throw new BadRequestError('Missing candlestick type / body ratio');

		const selectedDate = new Date();
		const startMonth = selectedDate.getMonth() - +selectedMonth;
		selectedDate.setMonth(startMonth);
		const selectedDateISO = selectedDate.toISOString();

		let serializedStockData;

		if (!bodyRatio) {
			serializedStockData = await stockService.getStockDataByCandlestickType(selectedDateISO, candlestickType!);
		} else {
			if (candlestickType === 'doji')
				serializedStockData = await stockService.getStockDataByCandlestickRatioDoji(selectedDateISO, upperShadowRatio!);
			if (candlestickType !== 'doji')
				serializedStockData = await stockService.getStockDataByCandlestickRatio(
					selectedDateISO,
					upperShadowRatio,
					bodyRatio,
					candlestickType
				);
		}

		if (!serializedStockData)
			return res
				.status(HTTP_STATUS.OK)
				.json({ status: 'success', message: 'Get stock data by candle direction successed.', data: { stockData: [] } });

		const stockData = Helpers.getDeserializedChartData(serializedStockData);

		res.status(HTTP_STATUS.OK).json({ status: 'success', message: 'Get stock data by candle direction successed.', data: { stockData } });
	}
}
