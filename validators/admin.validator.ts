import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("ADMIN", "USER").required(),
});

export const updateUserSchema = Joi.object({
  role: Joi.string().valid("ADMIN", "USER").required(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
