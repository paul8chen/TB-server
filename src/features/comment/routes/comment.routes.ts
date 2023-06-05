import express, { Router } from 'express';

import { Comment } from '@comment/controllers/comment';

class CommentRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/create-comment', Comment.prototype.create);
		this.router.get('/all-comments/:postId', Comment.prototype.readAllComment);
		this.router.get('/name-lists/:postId', Comment.prototype.readAllCommentNameList);
		this.router.get('/:postId/:commentId', Comment.prototype.read);

		return this.router;
	}
}

export const commentRoutes = new CommentRoute();
