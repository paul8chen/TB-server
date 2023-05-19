import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';
import { Helpers } from '@global/helpers/Helpers';

class AuthService {
	public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
		const query = { $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: email.toLowerCase() }] };
		const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;

		return user;
	}

	public async getUserByUsername(username: string): Promise<IAuthDocument | null> {
		const user = await AuthModel.findOne({ username: Helpers.firstLetterUppercase(username) }).exec();

		return user;
	}

	public async createAuth(data: IAuthDocument): Promise<void> {
		await AuthModel.create(data);
	}
}

export const authService = new AuthService();
