import Joi from "Joi"

export const checkUrlSchema = Joi.object({
  url:Joi.string().required()
})

const httpsUrlExtension = Joi.extend((joi) => ({
  type: 'httpsUrl',
  base: joi.string().uri(),
  messages: {
    'httpsUrl.invalid': 'A URL deve ser do tipo "https://"',
  },
  rules: {
    https: {
      validate(value, helpers) {
        if (!value.startsWith('https://')) {
          return helpers.error('httpsUrl.invalid');
        }
        return value;
      },
    },
  },
}));