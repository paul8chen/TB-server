export class Helpers {
	static firstLetterUppercase(str: string): string {
		return str
			.split(' ')
			.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
			.join(' ');
	}

	static generateRandomInt(intLength: number): number {
		let result = '';

		for (let i = 0; i < intLength; i++) {
			result += Math.floor(Math.random() * 9);
		}

		return parseInt(result, 10);
	}

	/* eslint-disable @typescript-eslint/no-explicit-any */
	static parseJSON(prop: string): any {
		try {
			return JSON.parse(prop);
		} catch (err) {
			return prop;
		}
	}

	static pause(duration: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, duration);
		});
	}
}
