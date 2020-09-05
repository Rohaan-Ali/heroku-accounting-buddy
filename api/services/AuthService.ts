import { Request } from "express";
import { GarageService } from "../services/GarageService";
import { SigninUser } from "../models/response/SigninUser";

const bcrypt = require("bcrypt");
const User = require("../db/models/User");
const StatusCodes = require("../config/StatusCodes");
const RoleCD = require("../config/RoleCD");

export class AuthService {
  // New user validation and registration
  async RegisterUser(signupRequest: Request): Promise<Number> {
    const { Name, Email, Password } = signupRequest.body;
    const user = await User.findOne({ where: { Email: Email } });
    let status = 0;

    if (user) {
      status = StatusCodes.SignupCodes.EmailAlreadyRegistered;
    } else {
      const newUser = User.build({ Name: Name, Email: Email });
      const garageService = new GarageService();
      const garageId = await garageService.FindWorker(Email);
      //console.log("Garage Id : ", garageId);
      if (garageId !== 0) {
        newUser.RoleCD = RoleCD.Roles.GarageWorker;
        newUser.GarageId = garageId;
      } else {
        newUser.RoleCD = RoleCD.Roles.Unassigned;
      }

      await bcrypt
        .hash(Password, 10)
        .then(async function (hash: any, err: any) {
          if (err) throw err;
          newUser.Password = hash;
          await newUser
            .save()
            .then(async () => {
              status = StatusCodes.SignupCodes.Success;
            })
            .catch(async (err: any) => {
              console.log(err);
              status = StatusCodes.SignupCodes.Failure;
            });
        });
    }
    return status;
  }

  // Validate user for signin and return authorized token
  async ValidateUser(signinRequest: Request): Promise<Number> {
    let status = 0;

    const { Email, Password } = signinRequest.body;
    const user = await User.findOne({
      where: { Email: Email, IsActive: true, IsDeleted: false },
    });

    if (!user) {
      status = StatusCodes.SigninCodes.InvalidEmail;
    } else {
      await bcrypt
        .compare(Password, user.Password)
        .then((isMatched: any) => {
          if (isMatched) {
            status = StatusCodes.SigninCodes.Success;
          } else {
            status = StatusCodes.SigninCodes.IncorrectPassword;
          }
        })
        .catch((err: any) => {
          console.log(err);
          status = StatusCodes.SigninCodes.Failure;
        });
    }

    return status;
  }

  // Get signedin user details
  async GetSigninUser(emailId: string): Promise<any> {
    let signinUser = new SigninUser();

    const user = await this.GetUserByEmail(emailId);
    if (user !== null) {
      signinUser.Email = user.Email;
      signinUser.UserId = user.UserId;
      signinUser.Name = user.Name;
      signinUser.RoleCD = user.RoleCD;
      signinUser.GarageId = user.GarageId;
      signinUser.IsActive = user.IsActive;
      signinUser.IsDeleted = user.IsDeleted;
      return signinUser;
    }

    return null;
  }

  // Used to get user by email
  async GetUserByEmail(Email: String): Promise<any> {
    const user = await User.findOne({ where: { Email: Email } });
    if (user) {
      return user;
    }
    return null;
  }

  // Used to get user by user id
  async GetUserByUserId(UserId: String): Promise<any> {
	const user = await User.findOne({ where: { UserId: UserId } });
    if (user) {
      return user;
    }
    return null;
  }
}
