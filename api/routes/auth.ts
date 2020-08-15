import express from "express";
import Joi from "joi";

const router = express.Router();
import { AuthService } from "../services/AuthService";
import { ValidationError } from "../models/ValidationError";
const StatusCodes = require("../config/StatusCodes");

router.post("/signup", async (req, res) => {
  let signupErrors = new Array<ValidationError>();

  const validationResult = await validateUser(req.body);
  if (validationResult.error) {
    for (const index in validationResult.error.details) {
      let validationError = new ValidationError();
      validationError.FieldName = validationResult.error.details[index].path[0];
      validationError.Message = validationResult.error.details[index].message;
      signupErrors.push(validationError);
    }
    res.status(400).json({
      success: false,
      user: req.body,
      errors: signupErrors,
    });
    return;
  } else {
    const authService = new AuthService();
    const status = await authService.RegisterUser(req);

    console.log("Status : ", status);
    if (status == StatusCodes.SignupCodes.Success) {
      res.status(200).json({
        success: true,
        user: req.body,
        errors: null,
      });
    } else if (status == StatusCodes.SignupCodes.EmailAlreadyRegistered) {
      let validationError = new ValidationError();
      validationError.FieldName = "Email";
      validationError.Message = "Email already registered!";
      signupErrors.push(validationError);

      res.status(200).json({
        success: false,
        user: req.body,
        errors: signupErrors,
      });
    } else if (status == StatusCodes.SignupCodes.InternalServerError) {
      let validationError = new ValidationError();
      validationError.FieldName = "General";
      validationError.Message =
        "Error while saving data. Please try again after sometime!";
      signupErrors.push(validationError);

      res.status(200).json({
        success: false,
        user: req.body,
        errors: signupErrors,
      });
    }
    return;
  }
});

async function validateUser(user: any) {
  const schema = Joi.object({
    Name: Joi.string()
      .regex(
        /^[a-zA-Z ]*$/,
        "Name should only contains characters or whitespace"
      )
      .min(3)
      .max(50)
      .required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(user, { abortEarly: false });
}

module.exports = router;
