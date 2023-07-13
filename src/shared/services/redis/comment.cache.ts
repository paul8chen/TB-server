import { BaseCache } from '@service/redis/base.cache';
import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface';

export class CommentCache extends BaseCache<ICommentDocument> {
	constructor() {
		super('Comment-Cache');
	}

	public async saveCommentToCache(commentData: ICommentDocument): Promise<void> {
		const { postId } = commentData;
		const serializedCommentData = JSON.stringify(commentData);

		const multi = this.client.multi();

		multi.rPush(`comments:${postId}`, serializedCommentData);
		multi.hIncrBy(`posts:${postId}`, 'commentsCount', 1);

		await multi.exec();
	}

	public async getAllCommentFromCache(postId: string, start: number, end: number): Promise<ICommentDocument[]> {
		const commentDatas: ICommentDocument[] = [];

		const serializedCommentDatas = await this.client.lRange(`comments:${postId}`, start, end);

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
		const commentDatas = await this.getAllCommentFromCache(postId, 0, -1);

		const commentData = commentDatas.find((data) => data._id === commentId);

		return commentData;
	}

	public async getTotalPostCommentsFromCache(postId: string): Promise<number> {
		return await this.client.lLen(`comments:${postId}`);
	}

	public async updatePostCommentFromCache(commentData: ICommentDocument): Promise<void | string> {
		const { postId, _id } = commentData;

		const serializedCommentDatas = await this.client.lRange(`comments:${postId}`, 0, -1);

		let updatedCommentDataIndex: number;
		let isUpdatedDataExist = false;
		serializedCommentDatas.forEach((serializedCommentData, index) => {
			const commentData = JSON.parse(serializedCommentData);

			if (commentData._id !== _id) return;

			updatedCommentDataIndex = index;
			isUpdatedDataExist = true;
		});

		if (!isUpdatedDataExist) return;

		return await this.client.lSet(`comments:${postId}`, updatedCommentDataIndex!, JSON.stringify(commentData));
	}

	public async deleteCommentFromCache(commentData: ICommentDocument): Promise<void> {
		const { postId } = commentData;

		const multi = this.client.multi();

		multi.lRem(`comments:${postId}`, -1, JSON.stringify(commentData));
		multi.hIncrBy(`posts:${postId}`, 'commentsCount', -1);

		await multi.exec();
	}
}
