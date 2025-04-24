import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("local", "development", "test", "production")
    .required(),

  JWT_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC: Joi.number().default(3600),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
});
