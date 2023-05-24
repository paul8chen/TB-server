import Joi from 'joi';

const addMaSchema = Joi.object().keys({
	param: Joi.number().required().positive().messages({
		'number.base': 'Price must be of type number',
		'number.empty': 'Price is a required field',
		'number.positive': 'Price must be a positive number'
	})
});

export { addMaSchema };
