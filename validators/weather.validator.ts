import Joi from "joi";

// Validation schema for /weather query parameters
const citySchema = Joi.object({
  city: Joi.string().required(),
  lat: Joi.forbidden(),
  lon: Joi.forbidden(),
  units: Joi.string().optional(),
});

const coordSchema = Joi.object({
  city: Joi.forbidden(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  units: Joi.string().optional(),
});

export const weatherQuerySchema = Joi.alternatives().try(
  citySchema,
  coordSchema
);
