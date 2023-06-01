import { IPostDocument, IGetPostsQuery } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { UserModel } from '@user/models/user.schema';

class PostService {
	public async createPost(userId: string, postData: IPostDocument): Promise<void> {
		const post = PostModel.create(postData);
		const user = UserModel.findByIdAndUpdate({ _id: userId }, { $inc: { postsCount: 1 } });

		await Promise.all([post, user]);
	}

	public async getPosts(
		query: IGetPostsQuery,
		skip: number,
		limit: number,
		sort: { [key: string]: number } = { createdAt: -1 }
	): Promise<IPostDocument[]> {
		const posts = await PostModel.find(query, { _id: 1, userId: 1, createdAt: 1 }, { skip, limit, sort });

		return posts;
	}

	public async getPostsCount(query: IGetPostsQuery): Promise<number> {
		const posts = await PostModel.countDocuments(query);

		return posts;
	}

	public async deletePost(userId: string, postId: string): Promise<void> {
		const deletePostQuery = PostModel.deleteOne({ postsCount: postId });
		const updateUserQuery = UserModel.findOneAndUpdate({ _id: userId }, { $inc: { postsCount: -1 } });

		await Promise.all([deletePostQuery, updateUserQuery]);
	}

	public async updatePost(postId: string, updateData: IPostDocument): Promise<void> {
		await PostModel.updateOne({ _id: postId }, { $set: updateData });
	}
}

export const postService = new PostService();
