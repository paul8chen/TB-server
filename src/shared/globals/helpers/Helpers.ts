import { Stock } from '@stock/models/stock.schema';
import { IStockDocument, IDeSerializedIStockDocument, IChartData } from '@stock/interfaces/stock.interface';

export class Helpers {
	static firstLetterUppercase(str: string): string {
		return str
			.split(' ')
			.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
			.join(' ');
	}

	static generateRandomInt(intLength: number): number {
		let result = '';

		for (let i = 0; i < intLength; i++) {
			result += Math.floor(Math.random() * 9);
		}

		return parseInt(result, 10);
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	static parseJSON(prop: string): any {
		try {
			return JSON.parse(prop);
		} catch (err) {
			return prop;
		}
	}

	static pause(duration: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, duration);
		});
	}

	static getDeserializedStockData(data: Stock[]): IDeSerializedIStockDocument[] {
		const deserializedData = data.map((serializedStockData) => Helpers.deserializeStockData(serializedStockData.dataValues));

		return deserializedData;
	}

	static deserializeStockData(data: IStockDocument): IDeSerializedIStockDocument {
		const { date, open, high, low, close } = data;

		return { x: +date, y: [open, high, low, close] };
	}

	static getDeserializedChartData(data: Stock[]): IChartData[] {
		const deserializedData = data.map((serializedStockData) => Helpers.deserializeChartData(serializedStockData));

		return deserializedData;
	}

	static deserializeChartData(data: IStockDocument): IChartData {
		const { date, ma, close } = data;

		const y = close || ma;

		return { x: +date, y };
	}
}
