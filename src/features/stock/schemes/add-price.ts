import Joi, { ObjectSchema } from 'joi';

const addPriceSchema: ObjectSchema = Joi.object().keys({
	price: Joi.number().required().positive().messages({
		'number.base': 'Price must be of type number',
		'number.empty': 'Price is a required field',
		'number.positive': 'Price must be a positive number'
	}),
	tickId: Joi.string().required().messages({
		'string.base': 'Tick must be of type string',
		'string.empty': 'Tick is a required field'
	})
});

export { addPriceSchema };
