import express, { Router } from 'express';

import { Post } from '@post/controllers/post';

class PostRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.post('/create-post', Post.prototype.create);
		this.router.get('/get-post/:page', Post.prototype.read);
		this.router.patch('/update-post/:postId', Post.prototype.update);
		this.router.delete('/delete-post/:postId', Post.prototype.delete);

		return this.router;
	}
}

export const postRoutes = new PostRoute();
