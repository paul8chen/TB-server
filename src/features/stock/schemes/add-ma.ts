import Joi from 'joi';

const createMaSchema = Joi.object().keys({
	ma: Joi.number().required().min(1).messages({
		'number.base': 'Ma must be of type number',
		'number.empty': 'Ma is a required field',
		'number.min': 'Ma must greater than 1'
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
	maBy: Joi.string().required().valid('close', 'open', 'high', 'low').messages({
		'string.base': 'MaBy must be of type string',
		'string.empty': 'MaBy is a required field',
		'string.valid': 'Invalid maBy'
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

export { createMaSchema };
