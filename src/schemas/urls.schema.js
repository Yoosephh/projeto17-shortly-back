import Joi from "joi"

export const checkUrlSchema = Joi.object({
  url:Joi.string().uri().required()
})

