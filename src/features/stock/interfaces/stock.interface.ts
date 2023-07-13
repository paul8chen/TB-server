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

export interface IUpdatePriceDocument {
	price: number;
	date: string;
	breakRatio: number;
	color: string;
	isAbove: boolean;
}

export interface IUpdateMaDocument {
	ma: number;
	maBy: string;
	breakRatio: number;
	color: string;
	isAbove: boolean;
}

export interface IUpdateCandlestickDocument {
	bodyRatio: number;
	upperShadow: number;
	lowerShadow: number;
	candlestickType: string;
}
