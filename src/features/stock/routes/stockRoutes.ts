import express, { Router } from 'express';

import { StockFetcher } from '@stock/controllers/get-stock';
import { StockLoader } from '@stock/controllers/load-stock';
import { authmiddleware } from '@global/middlewares/auth.middleware';
import { PriceController } from '@stock/controllers/price';
import { MaAdder } from '@stock/controllers/add-ma';
import { TickCartController } from '@stock/controllers/tickCart';
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
		this.router.post('/add-tickCart', authmiddleware.verifyUser, TickCartController.prototype.create);
		this.router.post('/delete-tickCart', authmiddleware.verifyUser, TickCartController.prototype.delete);
		this.router.post('/add-tick', authmiddleware.verifyUser, TickController.prototype.create);
		this.router.post('/delete-tick', authmiddleware.verifyUser, TickController.prototype.delete);
		return this.router;
	}
}

export const stockRoutes = new StockRoutes();
