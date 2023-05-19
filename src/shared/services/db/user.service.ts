import { ObjectId } from 'mongodb';

import { UserModel } from '@user/models/user.schema';
import { IUserDocument } from '@user/interfaces/user.interface';

class UserService {
	public async createUser(data: IUserDocument): Promise<void> {
		await UserModel.create(data);
	}

	public async getUserByAuthId(authId: ObjectId | string): Promise<IUserDocument | null> {
		const user = await UserModel.findOne({ authId }).exec();

		return user;
	}

	public async getUserByUserId(userId: string): Promise<IUserDocument | null> {
		const user = await UserModel.findOne({ userId }).exec();

		return user;
	}
}

export const userService = new UserService();
