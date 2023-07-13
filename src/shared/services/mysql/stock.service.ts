import { Op, InferAttributes, QueryTypes } from 'sequelize';
import { Stock } from '@stock/models/stock.schema';
import { BaseService } from '@service/mysql/base.service';
import { mysqlConnection } from '@service/mysql/mysql.connection';

const { sequelize } = mysqlConnection;

class StockService extends BaseService<typeof Stock> {
	service = Stock;

	constructor() {
		super('stock');
	}

	public async createHistoricalData(data: InferAttributes<Stock>): Promise<void> {
		await this.service.create(data);
	}

	public async getHistoricalData(): Promise<Stock[]> {
		const data = await this.service.findAll({
			attributes: ['date', 'open', 'close', 'low', 'high']
		});

		return data;
	}

	public async getDataByDate(date: Date): Promise<Stock[]> {
		const data = await this.service.findAll({
			attributes: ['date', 'open', 'close', 'low', 'high'],
			where: {
				date: { [Op.gte]: date }
			}
		});

		return data;
	}

	public async getStockDataAboveByPrice(price: number, date: string, breakRatio: number): Promise<Stock[]> {
		const rawQuery = `
		SELECT date, close
		FROM
		(SELECT date, close , SUM(highP*${breakRatio}+lowP*${1 - breakRatio}) OVER(PARTITION BY date) AS lowP_ratio FROM
		(SELECT date, close, highP, lowP FROM btcusdt WHERE date >"${date}") AS INNERQUERY) AS InnerQuery
		WHERE  lowP_ratio >= ${price}
		`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataBreakThroughByPrice(price: number, date: string, breakRatio: number): Promise<Stock[]> {
		const rawQuery = `SELECT date, close FROM
		(SELECT date, close, price_ratio, LAG(price_ratio) OVER(ORDER BY date) AS prev_price_ratio FROM
		(SELECT date, close, (lowP*${breakRatio} + highP*${1 - breakRatio})  AS price_ratio FROM btcusdt
		WHERE date > "${date}") AS INNERQUERY) AS INNERQUERY
		WHERE prev_price_ratio < ${price} AND price_ratio > ${price}
		`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getMaData(date: string, ma: number, maBy: string): Promise<Stock[]> {
		const rawQuery = `SELECT date, ma
		FROM
			(SELECT date, AVG(${maBy}) OVER(ORDER BY date ROWS BETWEEN ${ma - 1} PRECEDING AND CURRENT ROW) AS ma FROM btcusdt
			WHERE date > "${date}") AS INNERQUERY`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataBreakThroughByMA(date: string, ma: number, maBy: string, candleRatio: number): Promise<Stock[]> {
		const rawQuery = `SELECT date, close FROM
		(SELECT date, close, ma, price_ratio, LAG(ma) OVER(ORDER BY date) AS prev_ma, LAG(price_ratio) OVER(ORDER BY date) AS prev_price_ratio FROM
		(SELECT date, close, AVG(${maBy}) OVER(ORDER BY date ROWS BETWEEN ${
			ma - 1
		} PRECEDING AND CURRENT ROW) AS ma, (lowP*${candleRatio}+highP*(1-${candleRatio}) ) AS price_ratio FROM
		(SELECT date, open, close, high, low, highP, lowP FROM btcusdt WHERE date > "${date}") AS INNERQUERY) AS INNERQUERY) AS INNERQUERY
		WHERE prev_price_ratio <= prev_ma AND price_ratio > ma`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataAboveByMA(date: string, ma: number, maBy: string, candleRatio: number): Promise<Stock[]> {
		const rawQuery = `SELECT date, close FROM
		(SELECT date, close, AVG(${maBy}) OVER(ORDER BY date ROWS BETWEEN ${
			ma - 1
		} PRECEDING AND CURRENT ROW) AS ma, (lowP*${candleRatio}+highP*(1-${candleRatio}) ) AS price_ratio FROM
		(SELECT date, open, close, high, low, highP, lowP FROM btcusdt WHERE date > "${date}") AS INNERQUERY) AS INNERQUERY
		WHERE  price_ratio > ma`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataByCandlestickRatio(
		date: string,
		upperShadowRatio: string | undefined,
		bodyRatio: string,
		candlestickType: string | undefined
	): Promise<Stock[]> {
		console.log('====================');
		console.log('BY RATIO');
		console.log('====================');
		const approxmateRange = upperShadowRatio ? 0.1 : 0.05;

		const upperShadowQuery = upperShadowRatio
			? `(upper_ratio < ${+upperShadowRatio + 0.1} AND upper_ratio > ${+upperShadowRatio - 0.1}) AND`
			: '';

		const compareSymbol = candlestickType === 'bullish' ? '>' : '<';
		const candlestickTypeQuery = candlestickType ? `AND close ${compareSymbol} open` : '';

		const rawQuery = `SELECT  date, close  FROM
		(SELECT date, close,  (upper_deltaP/deltaP) AS upper_ratio, (body_deltaP/deltaP) AS body_ratio FROM
		(SELECT date, close,(high-low) AS deltaP, (high-highP) AS upper_deltaP, (highP-lowP) AS body_deltaP FROM btcusdt WHERE date > "${date}" ${candlestickTypeQuery}) AS INNERQUERY) AS INNERQUERY
		WHERE ${upperShadowQuery} (body_ratio > ${+bodyRatio - approxmateRange} AND body_ratio < ${+bodyRatio + approxmateRange})`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataByCandlestickRatioDoji(date: string, upperShadowRatio: string): Promise<Stock[]> {
		console.log('====================');
		console.log('BY RATIO DOJI');
		console.log('====================');
		const rawQuery = `SELECT  date, close FROM
		(SELECT date, close, (upper_deltaP/deltaP) AS upper_ratio FROM
		(SELECT date, close, (high-low) AS deltaP, (high-highP) AS upper_deltaP FROM btcusdt WHERE date > "${date}" AND close = open) AS INNERQUERY) AS INNERQUERY
		WHERE (upper_ratio < ${+upperShadowRatio + 0.05} AND upper_ratio > ${+upperShadowRatio - 0.05}) `;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}

	public async getStockDataByCandlestickType(date: string, candlestickType: string): Promise<Stock[]> {
		console.log('====================');
		console.log('BY CANDLESTICK TYPE');
		console.log('====================');
		const compareSymbol = candlestickType !== 'doji' ? (candlestickType === 'bullish' ? '>' : '<') : '=';

		const rawQuery = `SELECT date, close FROM btcusdt WHERE date > "${date}" AND close ${compareSymbol} open`;

		const data: Stock[] = await sequelize.query(rawQuery, { type: QueryTypes.SELECT });

		return data;
	}
}

export const stockService = new StockService();
