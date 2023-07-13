export interface IUpdatePrice {
	TickId: string;
	price: number;
	newPrice: number;
}

export interface IStockDocument {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	ma?: number;
}

export interface IDeSerializedIStockDocument {
	x: number;
	y: [number, number, number, number];
}

export interface IMaData {
	date: number;
	ma: number;
}

export interface IChartData {
	x: number;
	y: number | undefined;
}
