import Joi, { ObjectSchema } from 'joi';

const addReactionSchema: ObjectSchema = Joi.object().keys({
	username: Joi.string().required().messages({
		'any.required': 'username is a required property'
	}),
	postId: Joi.string().required().messages({
		'any.required': 'postId is a required property'
	}),
	type: Joi.string().required().valid('rocket', 'bullish', 'bearish').messages({
		'any.required': 'Reaction type is a required property',
		'any.valid': 'Invalid reaction type'
	}),
	profilePicture: Joi.string().optional().allow(null, '')
});

const udpateReactionSchema: ObjectSchema = Joi.object().keys({
	profilePicture: Joi.string().optional().allow(null, ''),
	username: Joi.string().optional().allow(null, ''),
	postId: Joi.string().required().messages({
		'any.required': 'postId is a required property'
	}),
	type: Joi.string().required().valid('rocket', 'bullish', 'bearish').messages({
		'any.required': 'Reaction type is a required property',
		'any.valid': 'Invalid reaction type'
	})
});

export { addReactionSchema, udpateReactionSchema };
