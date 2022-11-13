import * as Joi from 'joi';

export const confirmationCodeValidator = Joi.object({
  authCode: Joi.number().min(100000).max(999999).required()
});
