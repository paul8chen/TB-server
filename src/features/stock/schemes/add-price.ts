import Joi, { ObjectSchema } from 'joi';

const createPriceSchema: ObjectSchema = Joi.object().keys({
	price: Joi.number().required().positive().messages({
		'number.base': 'Price must be of type number',
		'number.empty': 'Price is a required field',
		'number.positive': 'Price must be a positive number'
	}),
	indicatorType: Joi.string().required().valid('price', 'ma', 'candlestick').messages({
		'string.base': 'IndicatorType must be of type string',
		'string.empty': 'IndicatorType is a required field',
		'string.valid': 'Invalid indicatorType'
	}),
	TickId: Joi.string().required().messages({
		'string.base': 'Tick must be of type string',
		'string.empty': 'Tick is a required field'
	}),
	date: Joi.date().messages({
		'date.base': 'Invalid date'
	}),
	color: Joi.string().required().messages({
		'string.base': 'Color must be of type string',
		'string.empty': 'Color is a required field'
	}),
	breakRatio: Joi.number().required().messages({
		'number.base': 'BreakRatio must be of type number',
		'number.empty': 'BreakRatio is a required field'
	}),
	isAbove: Joi.boolean().required().messages({
		'boolean.base': 'IsAbove must be of type boolean'
	})
});

export { createPriceSchema };
