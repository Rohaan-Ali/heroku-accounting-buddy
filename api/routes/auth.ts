import express from "express";
import Joi from "joi";
import { AuthService } from "../services/AuthService";
import { ValidationError } from "../models/ValidationError";

const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const StatusCodes = require("../config/StatusCodes");
const Keys = require("../config/keys");

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

router.post("/signin", async (req, res) => {
  let signinErrors = new Array<ValidationError>();

  const validationResult = await validateSigninUser(req.body);
  if (validationResult.error) {
    for (const index in validationResult.error.details) {
      let validationError = new ValidationError();
      validationError.FieldName = validationResult.error.details[index].path[0];
      validationError.Message = validationResult.error.details[index].message;
      signinErrors.push(validationError);
    }
    res.status(400).json({
      success: false,
      user: req.body,
      errors: signinErrors,
    });
    return;
  } else {
    const authService = new AuthService();
    const status = await authService.ValidateUser(req);

    console.log("Status : ", status);
    if (status == StatusCodes.SigninCodes.Success) {
      const user = await authService.GetUserByEmail(req.body.Email);
      // Issue Token
      const issuesToken = issueJWT(user.Email, user.UserId);
      res.status(200).json({
        success: true,
        token: issuesToken.token,
        expiresIn: issuesToken.expires,
        errors: null,
      });
    } else if (status == StatusCodes.SigninCodes.InvalidEmail) {
      let validationError = new ValidationError();
      validationError.FieldName = "Email";
      validationError.Message = "Invalid Email Address";
      signinErrors.push(validationError);

      res.status(200).json({
        success: false,
        user: req.body,
        errors: signinErrors,
      });
    } else if (status == StatusCodes.SigninCodes.IncorrectPassword) {
      let validationError = new ValidationError();
      validationError.FieldName = "Password";
      validationError.Message = "Password Incorrect";
      signinErrors.push(validationError);

      res.status(200).json({
        success: false,
        user: req.body,
        errors: signinErrors,
      });
    } else if (status == StatusCodes.SigninCodes.InternalServerError) {
      let validationError = new ValidationError();
      validationError.FieldName = "General";
      validationError.Message =
        "Error while processing request. Please try again after sometime!";
      signinErrors.push(validationError);

      res.status(200).json({
        success: false,
        user: req.body,
        errors: signinErrors,
      });
    }
    return;
  }
});

router.get(
  "/getsigninuser/:emailid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const emailId = req.params.emailid;
    let getUserErrors = new Array<ValidationError>();

    if (emailId != null && emailId.length > 0) {
      const authService = new AuthService();
      const signinUser = await authService.GetSigninUser(emailId);

      if (signinUser !== null) {
        res.status(200).json({
          success: true,
          errors: null,
          signinUser: signinUser,
        });
      } else {
        let validationError = new ValidationError();
        validationError.FieldName = "EmailId";
        validationError.Message = "User Not Found!";

        res.status(200).json({
          success: false,
          errors: validationError,
          signinUser: null,
        });
      }
    }
    return;
  }
);

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
async function validateSigninUser(user: any) {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().required(),
  });

  return schema.validate(user, { abortEarly: false });
}
function issueJWT(Email: any, UserId: any) {
  const payload = {
    Email: Email,
    UserId: UserId,
  };
  const signedToken = jwt.sign(payload, Keys.PassportSecretKey, {
    expiresIn: Keys.JwtExpiresIn,
  });
  return {
    token: signedToken,
    expires: Keys.JwtExpiresIn,
  };
}
module.exports = router;
