import Joi, { ObjectSchema } from 'joi';

const createCandlestickSchema: ObjectSchema = Joi.object().keys({
	bodyRatio: Joi.required().messages({
		'any.empty': 'BodyRatio is a required field'
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
	upperShadow: Joi.required().messages({
		'any.empty': 'UpperShadow is a required field'
	}),
	lowerShadow: Joi.required().messages({
		'any.empty': 'LowerShadow is a required field'
	}),
	candlestickType: Joi.string().required().messages({
		'string.base': 'CandlestickType must be of type string',
		'string.empty': 'CandlestickType is a required field'
	})
});

const updateCandlestickSchema: ObjectSchema = Joi.object().keys({
	id: Joi.string().required().messages({
		'string.base': 'Id must be of type string',
		'string.empty': 'Id is a required field'
	}),
	bodyRatio: Joi.required().messages({
		'any.empty': 'BodyRatio is a required field'
	}),
	upperShadow: Joi.required().messages({
		'any.empty': 'UpperShadow is a required field'
	}),
	lowerShadow: Joi.required().messages({
		'any.empty': 'LowerShadow is a required field'
	}),
	candlestickType: Joi.string().required().messages({
		'string.base': 'CandlestickType must be of type string',
		'string.empty': 'CandlestickType is a required field'
	})
});

export { createCandlestickSchema, updateCandlestickSchema };
