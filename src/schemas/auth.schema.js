import Joi from "Joi"

export const signUpSchema = Joi.object({
  name:Joi.string().required(),
  email:Joi.string().email().required(),
  password:Joi.string().min(3).required().label('Password'),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').options({messages: {'any.only':'{{#label}} não é igual à password'}})
})

export const signInSchema = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().min(3).required().label('Password')
})