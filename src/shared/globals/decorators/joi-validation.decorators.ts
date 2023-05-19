/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, desc: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
	return (_target: any, _key: string, desc: PropertyDescriptor) => {
		const method = desc.value;

		desc.value = async function (...args: any[]) {
			const req: Request = args[0];
			// const { error } = await Promise.resolve(schema.validate(req.body));

			const { error } = schema.validate(req.body);

			if (error?.details) throw new JoiRequestValidationError(error.details[0].message);

			return method.apply(this, args);
		};

		return desc;
	};
}
