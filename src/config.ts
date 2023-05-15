import dotenv from 'dotenv';
import bunyan from 'bunyan';

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

	public validateConfig(): void {
		for (const [key, val] of Object.entries(this)) {
			if (val === '') throw new Error(`Config ${key} is undefined`);
		}
	}

	public createLogger(name: string): bunyan {
		return bunyan.createLogger({ name, level: 'debug' });
	}
}

export const config: Config = new Config();
