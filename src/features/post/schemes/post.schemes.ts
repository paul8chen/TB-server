import Joi, { ObjectSchema } from 'joi';

export const postSchema: ObjectSchema = Joi.object().keys({
	post: Joi.string().optional().allow(null, ''),
	bgColor: Joi.string().optional().allow(null, ''),
	privacy: Joi.string().optional().allow(null, ''),
	profilePicture: Joi.string().optional().allow(null, ''),
	commentsCount: Joi.number().required(),
	imgVersion: Joi.string().optional().allow(null, ''),
	imgId: Joi.string().optional().allow(null, ''),
	image: Joi.string().optional().allow(null, '')
});
