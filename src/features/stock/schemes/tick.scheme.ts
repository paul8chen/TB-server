import Joi, { ObjectSchema } from 'joi';

const createTickSchema: ObjectSchema = Joi.object().keys({
	tickName: Joi.string().required().messages({
		'string.base': 'TickName must be of type string',
		'string.empty': 'TickName is a required field'
	}),
	totalIndicator: Joi.number().min(0).required().messages({
		'number.base': 'TotalIndicator must be of type number',
		'number.empty': 'TotalIndicator is a required field',
		'number.min': 'TotalIndicator must greater than 0'
	}),
	uId: Joi.string().required().messages({
		'string.base': 'UId must be of type string',
		'string.empty': 'UId is a required field'
	})
});

const readTickSchema: ObjectSchema = Joi.object().keys({
	uId: Joi.number().integer().required().messages({
		'number.base': 'uId must be of type number',
		'number.empty': 'uId is a required field',
		'number.integer': 'uId must be a integer'
	})
});

export { createTickSchema, readTickSchema };
