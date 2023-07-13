import express, { Router } from 'express';

import { StockFetcher } from '@stock/controllers/get-stock';
import { StockLoader } from '@stock/controllers/load-stock';
import { authmiddleware } from '@global/middlewares/auth.middleware';
import { PriceController } from '@stock/controllers/price';
import { MaAdder } from '@stock/controllers/add-ma';
import { TickController } from '@stock/controllers/tick';

class StockRoutes {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public loadStockRoute(): Router {
		this.router.get('/load-stock', authmiddleware.verifyUser, authmiddleware.isAdmin, StockLoader.prototype.create);

		return this.router;
	}

	public routes(): Router {
		this.router.get('/get-stock', StockFetcher.prototype.read);
		this.router.get('/get-stock/:selectedMonth', StockFetcher.prototype.readByMonth);
		this.router.get('/get-price', StockFetcher.prototype.readPriceFiltered);
		this.router.get('/get-MA', StockFetcher.prototype.readMa);
		this.router.get('/get-candlestick', StockFetcher.prototype.readByCandleStick);

		return this.router;
	}

	public indicatorRoute(): Router {
		this.router.post('/add-price', authmiddleware.verifyUser, PriceController.prototype.create);
		this.router.patch('/update-price', authmiddleware.verifyUser, PriceController.prototype.update);
		this.router.post('/delete-price', authmiddleware.verifyUser, PriceController.prototype.delete);
		this.router.post('/add-ma', authmiddleware.verifyUser, MaAdder.prototype.create);
		return this.router;
	}

	public tickRoute(): Router {
		this.router.post('/add-tick', authmiddleware.verifyUser, TickController.prototype.create);
		this.router.post('/get-tick', authmiddleware.verifyUser, TickController.prototype.read);
		this.router.get('/get-tick-indicator/:tickId', authmiddleware.verifyUser, TickController.prototype.readIndicator);
		this.router.post('/delete-tick', authmiddleware.verifyUser, TickController.prototype.delete);
		return this.router;
	}
}

export const stockRoutes = new StockRoutes();
