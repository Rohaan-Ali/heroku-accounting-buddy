import { Request } from "express";

import { GarageService } from "../services/GarageService";
const bcrypt = require("bcrypt");
const User = require("../db/models/User");
const StatusCodes = require("../config/StatusCodes");

export class AuthService {
  async RegisterUser(signupRequest: Request): Promise<Number> {
    const { Name, Email, Password } = signupRequest.body;
    const user = await User.findOne({ where: { Email: Email } });

    if (user) {
      return StatusCodes.SignupCodes.EmailAlreadyRegistered;
    } else {
      const newUser = User.build({ Name: Name, Email: Email, RoleCD: 103 });
      const garageService = new GarageService();
      const garageId = garageService.FindWorker(Email);
      //   if (garageId !== 0) {
      //     newUser.RoleCD = 102;
      //     newUser.GarageId = garageId;
      //   } else {
      //     newUser.RoleCD = 103;
      //   }

      bcrypt.genSalt(10, function (err: any, salt: any) {
        bcrypt.hash(Password, salt, function (err: any, hash: any) {
          if (err) throw err;
          newUser.Password = hash;
          newUser
            .save()
            .then(() => {
              return StatusCodes.SignupCodes.Success;
            })
            .catch((err: any) => {
              console.log(err);
              return StatusCodes.SignupCodes.Failure;
            });
        });
      });
    }
    return StatusCodes.SignupCodes.Failure;
  }
}
