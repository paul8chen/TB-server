import express, { Express } from 'express';

import { TBServer } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from './config';

class Application {
	public async initialize(): Promise<void> {
		this.loadConfig();
		await databaseConnection();
		const app: Express = express();
		const server: TBServer = new TBServer(app);
		server.start();
	}

	private loadConfig(): void {
		config.validateConfig();
	}
}

const application: Application = new Application();
application.initialize();
