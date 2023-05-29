import ejs from 'ejs';
import path from 'path';

class EmailTemplate {
	public async forgotPasswordTemplate(username: string, resetLink: string): Promise<string> {
		return await ejs.renderFile(path.join(__dirname, 'templates', 'forgotPassword.ejs'), { username, resetLink });
	}

	public async resetPasswordTemplate(username: string): Promise<string> {
		return await ejs.renderFile(path.join(__dirname, 'templates', 'resetPassword.ejs'), { username });
	}
}

export default EmailTemplate;
