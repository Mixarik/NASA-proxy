const Joi = require('joi');

const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.base': `"username" should be a type of 'text'`,
                'string.empty': `"username" cannot be an empty field`,
                'string.min': `"username" should have a minimum length of {#limit}`,
                'any.required': `"username" is a required field`
            }),

        user_id: Joi.number()
            .integer()
            .required().messages({
                'string.base': `"user id" should be a type of 'number'`,
                'any.required': `"user id" is a required field`
            }),

        user_api_key: Joi.string()
            .min(3)
            .required().messages({
                'string.base': `"api key" should be a type of 'text'`,
                'string.empty': `"api key" cannot be an empty field`,
                'any.required': `"api key" is a required field`
            })

    })
;
module.exports = schema;