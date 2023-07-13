import express, { Router } from 'express';

import { Comment } from '@comment/controllers/comment';

class CommentRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/create-comment', Comment.prototype.create);
		this.router.get('/all-comments/:postId/:page', Comment.prototype.readAllComment);
		this.router.get('/name-lists/:postId', Comment.prototype.readAllCommentNameList);
		this.router.get('/:postId/:commentId', Comment.prototype.read);
		this.router.patch('/update-comment', Comment.prototype.update);
		this.router.delete('/delete-comment', Comment.prototype.delete);

		return this.router;
	}
}

export const commentRoutes = new CommentRoute();
