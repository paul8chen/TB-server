// prettier-ignore
import { Application, json, urlencoded, Response, Request, NextFunction,} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import compression from 'compression';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

import { config } from '@root/config';
import applicationRoute from '@root/routes';
import { IErrorResponse, CustomError } from '@global/helpers/error-handler';
import { PostSocket } from '@socket/post.socket';

const log = config.createLogger('server');

export class TBServer {
	constructor(private app: Application) {}

	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routeMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: 'session',
				keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
				maxAge: 24 * 7 * 3600 * 1000,
				secure: config.NODE_ENV !== 'development'
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: config.CLIENT_URL,
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			})
		);
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: '50mb' }));
		app.use(urlencoded({ limit: '50mb', extended: true }));
		app.set('view engine', 'ejs');
	}

	private routeMiddleware(app: Application): void {
		applicationRoute(app);
	}

	private globalErrorHandler(app: Application): void {
		// URL unavailable error handler
		app.all('*', (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
		});

		app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
			log.error(err);
			if (err instanceof CustomError) return res.status(err.statusCode).json(err.serializeErrors());

			next();
		});
	}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);
			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (err) {
			log.error(err);
		}
	}

	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		const io: Server = new Server(httpServer, {
			cors: {
				origin: config.CLIENT_URL,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			}
		});

		const pubClient = createClient({ url: config.REDIS_HOST });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);

		io.adapter(createAdapter(pubClient, subClient));
		return io;
	}

	private startHttpServer(httpServer: http.Server): void {
		log.info(`Server has started with process ${process.pid}`);
		httpServer.listen(config.SERVER_PORT, () => {
			log.info(`Server running on port ${config.SERVER_PORT}`);
		});
	}

	private socketIOConnections(io: Server): void {
		const postSocket = new PostSocket(io);

		postSocket.listen();
	}
}
