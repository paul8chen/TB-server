import express, { Router } from 'express';

import { Reaction } from '@reaction/controllers/reaction';

class ReactionRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	public routes(): Router {
		this.router.get('/get-reactions/:postId', Reaction.prototype.read);
		this.router.get('/get-reaction/:postId/:username', Reaction.prototype.readByUsername);
		this.router.post('/add-reaction', Reaction.prototype.create);
		this.router.put('/update-reaction', Reaction.prototype.update);
		this.router.delete('/delete-reaction/:postId', Reaction.prototype.delete);

		return this.router;
	}
}

export const reactionRoutes = new ReactionRoute();
