import { Server, Socket } from 'socket.io';
import { config } from '@root/config';

const log = config.createLogger('POST SOCKET');

export let postSocketIO: Server;

export class PostSocket {
	constructor(private io: Server) {
		postSocketIO = this.io;
	}

	public listen(): void {
		this.io.on('connection', (socket: Socket) => {
			log.info('Listening on POST SOCKET');
		});
	}
}
