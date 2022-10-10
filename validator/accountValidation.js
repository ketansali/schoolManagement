const Joi = require("joi");
const { badRequestResponse } = require("../middleware/response");
exports.registerValidation = (req, res, next) => {
  const reagister = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')).required().label('!!Passwords do not match'),
    contact: Joi.string()
      .min(10).max(10)
      .required(),
  });
  const { error } = reagister.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
    
  });
};

exports.loginValidation = (req, res, next) => {
  const login = Joi.object().keys({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }).required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  });
  const { error } = login.validate(req.body);
  if (!error) return next();
  const message = error.details.map((e) => e.message);
  return badRequestResponse(res, {
    message: message,
  });
};
