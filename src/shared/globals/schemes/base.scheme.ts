import Joi, { ObjectSchema, AnySchema } from 'joi';

export class BaseScheme {
	private schemeOption: { [key: string]: AnySchema } = {};

	constructor(private field: string) {}

	public stringOption(...params: string[]): this {
		params.forEach((param) => {
			this.schemeOption[param] = Joi.string()
				.required()
				.messages({
					'string.base': `${this.field} must be of type string.`,
					'string.empty': `${this.field} is a required field`
				});
		});

		return this;
	}

	public numberOption(...params: string[]): this {
		params.forEach((param) => {
			this.schemeOption[param] = Joi.number()
				.required()
				.positive()
				.messages({
					'number.base': `${this.field} must be of type number'`,
					'number.empty': `${this.field} is a required field`,
					'number.positive': `${this.field} must be a positive number`
				});
		});

		return this;
	}

	public createScheme(): ObjectSchema {
		return Joi.object().keys(this.schemeOption);
	}
}
