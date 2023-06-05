import Joi, { ObjectSchema } from 'joi';

export const postSchema: ObjectSchema = Joi.object().keys({
	post: Joi.string().optional().allow(null, ''),
	bgColor: Joi.string().optional().allow(null, ''),
	privacy: Joi.string().optional().allow(null, ''),
	profilePicture: Joi.string().optional().allow(null, ''),
	commentsCount: Joi.number().optional(),
	image: Joi.string().optional().allow(null, '')
});
