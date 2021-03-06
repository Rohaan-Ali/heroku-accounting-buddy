import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { GarageService } from "../services/GarageService";
import { AuthService } from "../services/AuthService";
import { ValidationError } from "../models/ValidationError";
import { DecodeJwtToken } from "../helper/Authorization";

const router = express.Router();
const passport = require("passport");
const StatusCodes = require("../config/StatusCodes");
const RoleCD = require("../config/RoleCD");

router.post(
  "/addworker",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // User validation using token
    const decodedToken = DecodeJwtToken(req);
    if (decodedToken.payload.UserId !== req.body.UserId) {
      let validationError = new ValidationError();
      validationError.FieldName = "UserId";
      validationError.Message = "You are not permitted to perform this task!";

      res.status(200).json({
        success: false,
        errors: validationError,
        signinUser: null,
      });
      return;
    }

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
        request: req.body,
        errors: addWorkerErrors,
      });
      return;
    } else {
      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(req.body.UserId);

      if (user != null) {
        if (
          user.RoleCD !== RoleCD.Roles.GarageAdmin ||
          user.GarageId != req.body.GarageId
        ) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: addWorkerErrors,
        });

        return;
      }

      const garageService = new GarageService();
      const status = await garageService.AddWorker(req);
      console.log(status);

      if (status == StatusCodes.AddWorkerCodes.Success) {
        res.status(200).json({
          success: true,
          request: req.body,
          errors: null,
        });
      } else if (status == StatusCodes.AddWorkerCodes.GarageNotFound) {
        let validationError = new ValidationError();
        validationError.FieldName = "GarageId";
        validationError.Message = "Invalid Garage Id!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: addWorkerErrors,
        });
      } else if (status == StatusCodes.AddWorkerCodes.WorkerAlreadyExists) {
        let validationError = new ValidationError();
        validationError.FieldName = "Email";
        validationError.Message = "Worker already registered!";
        addWorkerErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
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
          request: req.body,
          errors: addWorkerErrors,
        });
      }

      return;
    }
  }
);

router.post(
  "/garageonboarding",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // User validation using token
    const decodedToken = DecodeJwtToken(req);
    if (decodedToken.payload.UserId !== req.body.AdminUserId) {
      let validationError = new ValidationError();
      validationError.FieldName = "UserId";
      validationError.Message = "You are not permitted to perform this task!";

      res.status(200).json({
        success: false,
        errors: validationError,
        signinUser: null,
      });
      return;
    }

    let onboardGarageErrors = new Array<ValidationError>();
    const validationResult = await validateGarage(req.body);
    if (validationResult.error) {
      for (const index in validationResult.error.details) {
        let validationError = new ValidationError();
        validationError.FieldName =
          validationResult.error.details[index].path[0];
        validationError.Message = validationResult.error.details[index].message;
        onboardGarageErrors.push(validationError);
      }
      res.status(400).json({
        success: false,
        request: req.body,
        errors: onboardGarageErrors,
      });
      return;
    } else {
      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(req.body.AdminUserId);

      if (user != null) {
        if (user.RoleCD !== RoleCD.Roles.Unassigned) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";
        onboardGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: onboardGarageErrors,
        });

        return;
      }
      const garageService = new GarageService();
      const status = await garageService.OnboardGarage(req);
      console.log(status);

      if (status == StatusCodes.OnboardingGarageCodes.Success) {
        res.status(200).json({
          success: true,
          request: req.body,
          errors: null,
        });
      } else if (
        status == StatusCodes.OnboardingGarageCodes.GarageAlreadyRegistered
      ) {
        let validationError = new ValidationError();
        validationError.FieldName = "All";
        validationError.Message =
          "Garage already registered against these details!";
        onboardGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: onboardGarageErrors,
        });
      } else if (
        status == StatusCodes.OnboardingGarageCodes.InternalServerError
      ) {
        let validationError = new ValidationError();
        validationError.FieldName = "General";
        validationError.Message =
          "Error while updating data. Please try again after sometime!";
        onboardGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: onboardGarageErrors,
        });
      }
      return;
    }
  }
);

router.post(
  "/updategarage/:garageid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const GarageId = req.params.garageid;
    // User validation using token
    const decodedToken = DecodeJwtToken(req);
    if (decodedToken.payload.UserId !== req.body.AdminUserId) {
      let validationError = new ValidationError();
      validationError.FieldName = "UserId";
      validationError.Message = "You are not permitted to perform this task!";

      res.status(200).json({
        success: false,
        errors: validationError,
        signinUser: null,
      });
      return;
    }

    let updateGarageErrors = new Array<ValidationError>();
    const validationResult = await validateGarage(req.body);
    if (validationResult.error) {
      for (const index in validationResult.error.details) {
        let validationError = new ValidationError();
        validationError.FieldName =
          validationResult.error.details[index].path[0];
        validationError.Message = validationResult.error.details[index].message;
        updateGarageErrors.push(validationError);
      }
      res.status(400).json({
        success: false,
        request: req.body,
        errors: updateGarageErrors,
      });
      return;
    } else {
      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(req.body.AdminUserId);

      if (user != null) {
        if (
          user.RoleCD != RoleCD.Roles.GarageAdmin ||
          user.GarageId != GarageId
        ) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";
        updateGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: updateGarageErrors,
        });

        return;
      }

      const garageService = new GarageService();
      const status = await garageService.UpdateGarageDetails(req, GarageId);
      console.log(status);

      if (status == StatusCodes.UpdateGarageCodes.Success) {
        res.status(200).json({
          success: true,
          request: req.body,
          errors: null,
        });
      } else if (status == StatusCodes.UpdateGarageCodes.GarageNotFound) {
        let validationError = new ValidationError();
        validationError.FieldName = "GarageId";
        validationError.Message = "Invalid Garage Id!";
        updateGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: updateGarageErrors,
        });
      } else if (
        status == StatusCodes.UpdateGarageCodes.GarageAlreadyRegistered
      ) {
        let validationError = new ValidationError();
        validationError.FieldName = "All";
        validationError.Message =
          "Garage already registered against these details!";
        updateGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: updateGarageErrors,
        });
      } else if (status == StatusCodes.UpdateGarageCodes.Failure) {
        let validationError = new ValidationError();
        validationError.FieldName = "General";
        validationError.Message =
          "Error while updating data. Please try again after sometime!";
        updateGarageErrors.push(validationError);

        res.status(200).json({
          success: false,
          request: req.body,
          errors: updateGarageErrors,
        });
      }
    }
  }
);

router.get(
  "/getgarage/:garageid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const GarageId = parseInt(req.params.garageid);

    if (GarageId != null && GarageId > 0) {
      // User validation using token
      const decodedToken = DecodeJwtToken(req);

      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(
        decodedToken.payload.UserId
      );

      if (user != null) {
        if (
          user.RoleCD != RoleCD.Roles.GarageAdmin ||
          user.GarageId != GarageId
        ) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";

        res.status(200).json({
          success: false,
          request: req.body,
          errors: validationError,
        });

        return;
      } else {
        const garageService = new GarageService();
        const garage = await garageService.GetGarageDetails(GarageId);

        if (garage !== null) {
          res.status(200).json({
            success: true,
            errors: null,
            garageDetails: garage,
          });
          return;
        } else {
          let validationError = new ValidationError();
          validationError.FieldName = "GarageId";
          validationError.Message = "Garage Not Found!";

          res.status(200).json({
            success: false,
            errors: validationError,
            garageDetails: null,
          });
        }
        return;
      }
    } else {
      let validationError = new ValidationError();
      validationError.FieldName = "GarageId";
      validationError.Message = "Invalid Garage Id!";

      res.status(200).json({
        success: false,
        request: req.body,
        errors: validationError,
      });

      return;
    }
  }
);

router.post(
  "/offboardgarage/:garageid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const GarageId = parseInt(req.params.garageid);

    if (GarageId != null && GarageId > 0) {
      // User validation using token
      const decodedToken = DecodeJwtToken(req);

      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(
        decodedToken.payload.UserId
      );

      if (user != null) {
        if (
          user.RoleCD != RoleCD.Roles.GarageAdmin ||
          user.GarageId != GarageId
        ) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";

        res.status(200).json({
          success: false,
          request: req.body,
          errors: validationError,
        });

        return;
      } else {
        const garageService = new GarageService();
        const status = await garageService.OffboardGarage(GarageId);

        if (status == StatusCodes.OffboardGarage.Success) {
          res.status(200).json({
            success: true,
            request: req.body,
            errors: null,
          });
        } else if (status == StatusCodes.OffboardGarage.GarageNotFound) {
          let validationError = new ValidationError();
          validationError.FieldName = "GarageId";
          validationError.Message = "Invalid Garage Id!";

          res.status(200).json({
            success: false,
            request: req.body,
            errors: validationError,
          });
        } else if (status == StatusCodes.OffboardGarage.Failure) {
          let validationError = new ValidationError();
          validationError.FieldName = "General";
          validationError.Message =
            "Error while updating data. Please try again after sometime!";

          res.status(200).json({
            success: false,
            request: req.body,
            errors: validationError,
          });
        }

        return;
      }
    } else {
      let validationError = new ValidationError();
      validationError.FieldName = "GarageId";
      validationError.Message = "Invalid Garage Id!";

      res.status(200).json({
        success: false,
        errors: validationError,
      });

      return;
    }
  }
);

router.get(
  "/getworkers/:garageid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const GarageId = parseInt(req.params.garageid);

    if (GarageId != null && GarageId > 0) {
      // User validation using token
      const decodedToken = DecodeJwtToken(req);

      let isPermitted = true;
      const authService = new AuthService();
      const user = await authService.GetUserByUserId(
        decodedToken.payload.UserId
      );

      if (user != null) {
        if (
          user.RoleCD != RoleCD.Roles.GarageAdmin ||
          user.GarageId != GarageId
        ) {
          isPermitted = false;
        }
      } else {
        isPermitted = false;
      }

      if (!isPermitted) {
        let validationError = new ValidationError();
        validationError.FieldName = "UserId";
        validationError.Message =
          "You don't have persmission to complete this task!";

        res.status(200).json({
          success: false,
          request: req.body,
          errors: validationError,
        });

        return;
      } else {
        const garageService = new GarageService();
        const garageWorkers = await garageService.GetGarageWorkers(GarageId);

        if (garageWorkers.length > 0) {
          res.status(200).json({
            success: true,
            errors: null,
            workers: garageWorkers,
          });
          return;
        } else {
          let validationError = new ValidationError();
          validationError.FieldName = "GarageId";
          validationError.Message = "No worker found!";

          res.status(200).json({
            success: false,
            errors: validationError,
            workers: null,
          });
          return;
        }
      }
    } else {
      let validationError = new ValidationError();
      validationError.FieldName = "GarageId";
      validationError.Message = "Invalid Garage Id!";

      res.status(200).json({
        success: false,
        request: req.body,
        errors: validationError,
      });

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
async function validateGarage(garage: any) {
  const schema = Joi.object({
    AdminUserId: Joi.string().uuid().required(),
    Name: Joi.string().max(100).required(),
    Address: Joi.string().max(255).required(),
    BusinessNumber: Joi.string().alphanum().max(50).required(),
  });

  return schema.validate(garage, { abortEarly: false });
}

module.exports = router;
