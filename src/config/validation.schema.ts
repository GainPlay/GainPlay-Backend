import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("local", "development", "test", "production")
    .required(),

  DATABASE_URL: Joi.string().required(),
});
