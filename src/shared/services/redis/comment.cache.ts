import { BaseCache } from '@service/redis/base.cache';
import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface';

export class CommentCache extends BaseCache<ICommentDocument> {
	constructor() {
		super('Comment-Cache');
	}

	public async saveCommentToCache(commentData: ICommentDocument): Promise<void> {
		const { postId } = commentData;
		const serializedCommentData = JSON.stringify(commentData);

		const multi = await this.client.multi();

		multi.lPush(`comments:${postId}`, serializedCommentData);
		multi.hIncrBy(`posts:${postId}`, 'commentsCount', 1);

		await multi.exec();
	}

	public async getAllCommentFromCache(postId: string): Promise<ICommentDocument[]> {
		const commentDatas: ICommentDocument[] = [];

		const serializedCommentDatas = await this.client.lRange(`comments:${postId}`, 0, -1);
		serializedCommentDatas.forEach((serializedCommentData: string) => {
			const commentData: ICommentDocument = JSON.parse(serializedCommentData);

			commentDatas.push(commentData);
		});

		return commentDatas;
	}

	public async getAllCommentNameFromCache(postId: string): Promise<ICommentNameList> {
		const names: Set<string> = new Set();

		const commentNameList: ICommentNameList = { names: [], count: 0 };

		const serializedCommentDatas = await this.client.lRange(`comments:${postId}`, 0, -1);
		serializedCommentDatas.forEach((serializedCommentData) => {
			const commentData = JSON.parse(serializedCommentData);

			names.add(commentData.username);
			commentNameList.count++;
		});

		commentNameList.names = [...names];

		return commentNameList;
	}

	public async getCommentByIdFromCache(postId: string, commentId: string): Promise<ICommentDocument | undefined> {
		const commentDatas = await this.getAllCommentFromCache(postId);

		const commentData = commentDatas.find((data) => data._id === commentId);

		return commentData;
	}
}
