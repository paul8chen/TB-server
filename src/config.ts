import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
	public DATABASE_URL: string = process.env.DATABASE_URL || '';
	public JWT_TOKEN: string = process.env.JWT_TOKEN || '';
	public NODE_ENV: string = process.env.NODE_ENV || '';
	public SECRET_KEY_ONE: string = process.env.SECRET_KEY_ONE || '';
	public SECRET_KEY_TWO: string = process.env.SECRET_KEY_TWO || '';
	public CLIENT_URL: string = process.env.CLIENT_URL || '';
	public SERVER_PORT: string = process.env.SERVER_PORT || '';
	public REDIS_HOST: string = process.env.REDIS_HOST || '';
	public CLOUND_NAME: string = process.env.CLOUND_NAME || '';
	public CLOUND_API_KEY: string = process.env.CLOUND_API_KEY || '';
	public CLOUND_API_SECRET: string = process.env.CLOUND_API_SECRET || '';
	public BASE_PATH: string = process.env.BASE_PATH || '';
	public MAILTRAP_USER: string = process.env.MAILTRAP_USER || '';
	public MAILTRAP_PASS: string = process.env.MAILTRAP_PASS || '';
	public SG_API_KEY: string = process.env.SG_API_KEY || '';
	public MYSQL_HOST: string = process.env.MYSQL_HOST || '';
	public MYSQL_PORT: string = process.env.MYSQL_PORT || '';
	public MYSQL_USERNAME: string = process.env.MYSQL_USERNAME || '';
	public MYSQL_DATABASENAME: string = process.env.MYSQL_DATABASENAME || '';
	public MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD || '';
	public BASE_PAGE_LIMIT: string = process.env.BASE_PAGE_LIMIT || '';
	public REDIS_RETRY: string = process.env.REDIS_RETRY || '';
	public REDIS_RETRY_DELAY_MS: string = process.env.REDIS_RETRY_DELAY_MS || '';

	public validateConfig(): void {
		for (const [key, val] of Object.entries(this)) {
			if (val === '') throw new Error(`Config ${key} is undefined`);
		}
	}

	public createLogger(name: string): bunyan {
		return bunyan.createLogger({ name, level: 'debug' });
	}

	public cloudinaryConfig(): void {
		cloudinary.v2.config({
			cloud_name: this.CLOUND_NAME,
			api_key: this.CLOUND_API_KEY,
			api_secret: this.CLOUND_API_SECRET
		});
	}
}

export const config: Config = new Config();
