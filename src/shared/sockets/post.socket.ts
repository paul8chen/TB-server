import { Server, Socket } from 'socket.io';
import { config } from '@root/config';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

const log = config.createLogger('POST SOCKET');

export let postSocketIO: Server;

export class PostSocket {
	constructor(private io: Server) {
		postSocketIO = this.io;
	}

	public listen(): void {
		this.io.on('connection', (socket: Socket) => {
			socket.on('reaction', (reaction: IReactionDocument) => {
				this.io.emit('update-reaction', reaction);
			});

			socket.on('comment', (comment: ICommentDocument) => {
				this.io.emit('update-comment', comment);
			});
		});
	}
}
