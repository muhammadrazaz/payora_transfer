const Joi = require('joi');
const { password } = require('../../../customValidations/custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().optional().allow('', null),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    phone: Joi.string().optional().allow('', null),
    role: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const signUpSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const googleSignUp = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  signUpSchema,
  login,
  logout,
  verifyEmail,
  googleSignUp
};
