import { Server, Socket } from 'socket.io';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

export let postSocketIO: Server;

export class PostSocket {
	constructor(private io: Server) {
		postSocketIO = this.io;
	}

	public listen(): void {
		this.io.on('connection', (socket: Socket) => {
			socket.on('reaction', (reaction: IReactionDocument) => {
				this.io.emit('updateReaction', reaction);
			});

			socket.on('comment', (comment: ICommentDocument) => {
				this.io.emit('updateComment', comment);
			});
		});
	}
}
