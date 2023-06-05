import Joi, { ObjectSchema } from 'joi';

const addReactionSchema: ObjectSchema = Joi.object().keys({
	postId: Joi.string().required().messages({
		'any.required': 'postId is a required property'
	}),
	type: Joi.string().required().valid('like', 'love', 'happy', 'wow', 'sad', 'angry').messages({
		'any.required': 'Reaction type is a required property',
		'any.valid': 'Invalid reaction type'
	}),
	profilePicture: Joi.string().optional().allow(null, '')
});

const udpateReactionSchema: ObjectSchema = Joi.object().keys({
	postId: Joi.string().required().messages({
		'any.required': 'postId is a required property'
	}),
	type: Joi.string().required().valid('like', 'love', 'happy', 'wow', 'sad', 'angry').messages({
		'any.required': 'Reaction type is a required property',
		'any.valid': 'Invalid reaction type'
	})
});

export { addReactionSchema, udpateReactionSchema };
