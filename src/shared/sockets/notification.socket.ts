import { Server } from 'socket.io';

export let notificationSocketIO: Server;

export class NotificationSocket {
	public listen(io: Server): void {
		notificationSocketIO = io;
	}
}
