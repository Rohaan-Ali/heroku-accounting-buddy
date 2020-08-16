import express from "express";
import Joi from "joi";
import { GarageService } from "../services/GarageService";
import { ValidationError } from "../models/ValidationError";

const router = express.Router();
const passport = require("passport");
const StatusCodes = require("../config/StatusCodes");

router.post(
  "/addworker",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let addWorkerErrors = new Array<ValidationError>();

    const validationResult = await validateWorker(req.body);
    if (validationResult.error) {
      for (const index in validationResult.error.details) {
        let validationError = new ValidationError();
        validationError.FieldName =
          validationResult.error.details[index].path[0];
        validationError.Message = validationResult.error.details[index].message;
        addWorkerErrors.push(validationError);
      }
      res.status(400).json({
        success: false,
        user: req.body,
        errors: addWorkerErrors,
      });
      return;
    } else {
      const garageService = new GarageService();
      const status = await garageService.AddWorker(req);
      console.log(status);

      if (status == StatusCodes.AddWorkerCodes.Success) {
        res.status(200).json({
          success: true,
          user: req.body,
          errors: null,
        });
      } else if (status == StatusCodes.AddWorkerCodes.GarageNotFound) {
        let validationError = new ValidationError();
        validationError.FieldName = "GarageId";
        validationError.Message = "Invalid Garage Id!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          user: req.body,
          errors: addWorkerErrors,
        });
      } else if (status == StatusCodes.AddWorkerCodes.WorkerAlreadyExists) {
        let validationError = new ValidationError();
        validationError.FieldName = "Email";
        validationError.Message = "Worker already registered!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          user: req.body,
          errors: addWorkerErrors,
        });
      } else if (status == StatusCodes.SignupCodes.InternalServerError) {
        let validationError = new ValidationError();
        validationError.FieldName = "General";
        validationError.Message =
          "Error while updating data. Please try again after sometime!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          user: req.body,
          errors: addWorkerErrors,
        });
      }
      return;
    }
  }
);

async function validateWorker(worker: any) {
  const schema = Joi.object({
    UserId: Joi.string().uuid().required(),
    GarageId: Joi.number().greater(0).required(),
    Email: Joi.string().email().required(),
  });

  return schema.validate(worker, { abortEarly: false });
}

module.exports = router;
