import { ReactionModel } from '@reaction/models/reaction.schema';
import { PostModel } from '@post/models/post.schema';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';

class ReactionService {
	public async createReaction(reactionData: IReactionDocument, reactions: IReactions): Promise<void> {
		const { postId } = reactionData;

		const updateReactionData = ReactionModel.create(reactionData);
		const udpatePostReaction = PostModel.findOneAndUpdate({ postId }, { reactions });

		await Promise.all([updateReactionData, udpatePostReaction]);
	}

	public async updateReaction(reactionData: IReactionDocument, reactions: IReactions): Promise<void> {
		const { postId, username, type } = reactionData;

		const updateReactionData = ReactionModel.findOneAndUpdate({ postId, username }, { type });
		const udpatePostReaction = PostModel.findOneAndUpdate({ postId }, { reactions });

		await Promise.all([updateReactionData, udpatePostReaction]);
	}

	public async deleteReaction(reactionData: IReactionDocument, reactions: IReactions): Promise<void> {
		const { postId, username } = reactionData;

		const updateReactionData = ReactionModel.findOneAndDelete({ postId, username });
		const udpatePostReaction = PostModel.findOneAndUpdate({ postId }, { reactions });

		await Promise.all([updateReactionData, udpatePostReaction]);
	}

	public async getAllReaction(postId: string): Promise<IReactionDocument[]> {
		return await ReactionModel.find({ postId });
	}
}

export const reactionService = new ReactionService();
