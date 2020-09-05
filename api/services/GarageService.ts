import { Request } from "express";
import { Worker } from "../models/Worker";

const Garage = require("../db/models/Garage");
const User = require("../db/models/User");
const StatusCodes = require("../config/StatusCodes");
const RoleCD = require("../config/RoleCD");

export class GarageService {
  RegisterGarage() {
    const newGarage = Garage.build({
      Name: "Garage1",
      Address: "Address1",
      BusinessNumber: "15648631",
    });

    newGarage.save();
  }
  async FindWorker(email: string): Promise<Number> {
    let garageId = 0;

    const garages = await Garage.findAll({
      attributes: ["Id", "Workers"],
    });

    garages.forEach((garage: any) => {
      const dbGarage = garage.get({ plain: true });
      if (dbGarage.Workers != null) {
        let workers = new Array<Worker>();
        console.log(dbGarage.Workers);
        workers = JSON.parse(dbGarage.Workers);
        for (let w of workers) {
          if (w.Email === email) {
            garageId = dbGarage.Id;
          }
        }
      }
    });

    return garageId;
  }
  async AddWorker(addWorkerRequest: Request): Promise<Number> {
    const { GarageId, Email } = addWorkerRequest.body;
    let status = 0;

    const garage = await Garage.findByPk(GarageId);
    if (garage === null) {
      status = StatusCodes.AddWorkerCodes.GarageNotFound;
    } else {
      const foundGarageId = await this.FindWorker(Email);
      if (foundGarageId == 0) {
        let workers = new Array<Worker>();
        let worker: Worker = {
          Email: Email,
          IsActive: true,
        };
        if (garage.Workers == null) {
          workers.push(worker);
          let workersJSON = JSON.stringify(workers);
          await Garage.update(
            { Workers: workersJSON },
            {
              where: {
                Id: GarageId,
              },
            }
          )
            .then(() => {
              status = StatusCodes.AddWorkerCodes.Success;
            })
            .catch((err: any) => {
              console.log(err);
              status = StatusCodes.AddWorkerCodes.Failure;
            });
        } else {
          workers = JSON.parse(garage.Workers);
          workers.push(worker);
          let workersJSON = JSON.stringify(workers);
          await Garage.update(
            { Workers: workersJSON },
            {
              where: {
                Id: GarageId,
              },
            }
          )
            .then(async () => {
              const user = await User.findOne({ where: { Email: Email } });
              if (user) {
                await User.update(
                  { RoleCD: RoleCD.Roles.GarageWorker, GarageId: GarageId },
                  {
                    where: {
                      Email: Email,
                    },
                  }
                );
              }
              status = StatusCodes.AddWorkerCodes.Success;
            })
            .catch((err: any) => {
              console.log(err);
              status = StatusCodes.AddWorkerCodes.Failure;
            });
        }
      } else if (foundGarageId > 0) {
        status = StatusCodes.AddWorkerCodes.WorkerAlreadyExists;
      }
    }

    return status;
  }
  async OnboardGarage(onboardingRequest: Request): Promise<Number> {
    const {
      AdminUserId,
      Name,
      Address,
      BusinessNumber,
    } = onboardingRequest.body;
    let status = 0;

    const garage = await Garage.findOne({
      where: { Name: Name, Address: Address, BusinessNumber: BusinessNumber },
    });

    if (garage === null) {
      const newGarage = Garage.build({
        Name: Name,
        Address: Address,
        BusinessNumber: BusinessNumber,
      });

      await newGarage
        .save()
        .then(async () => {
          const user = await User.findOne({ where: { UserId: AdminUserId } });
          if (user) {
            await User.update(
              { RoleCD: RoleCD.Roles.GarageAdmin, GarageId: newGarage.Id },
              {
                where: {
                  UserId: AdminUserId,
                },
              }
            );
          }
          status = StatusCodes.OnboardingGarageCodes.Success;
        })
        .catch(async (err: any) => {
          console.log(err);
          status = StatusCodes.OnboardingGarageCodes.Failure;
        });
    } else {
      status = StatusCodes.OnboardingGarageCodes.GarageAlreadyRegistered;
    }

    /*Steps*/
    // 1. Check whether a garage exists with same name and business number as in request
    // 2. If no, register new garage
    // 3. update status of user to admin user

    return status;
  }
  async UpdateGarageDetails(
    onboardingRequest: Request,
    garageId: string
  ): Promise<Number> {
    const { Name, Address, BusinessNumber } = onboardingRequest.body;
    let status = 0;
    const GarageId = parseInt(garageId);

    const garage = await Garage.findByPk(GarageId);
    if (garage === null) {
      status = StatusCodes.UpdateGarageCodes.GarageNotFound;
    } else {
      const newGarage = await Garage.findOne({
        where: { Name: Name, Address: Address, BusinessNumber: BusinessNumber },
      });
      if (newGarage === null) {
        await Garage.update(
          { Name: Name, Address: Address, BusinessNumber: BusinessNumber },
          {
            where: {
              Id: GarageId,
            },
          }
        )
          .then(() => {
            status = StatusCodes.UpdateGarageCodes.Success;
          })
          .catch((err: any) => {
            console.log(err);
            status = StatusCodes.UpdateGarageCodes.Failure;
          });
      } else if (newGarage.Id != GarageId) {
        status = StatusCodes.UpdateGarageCodes.GarageAlreadyRegistered;
      } else {
        status = StatusCodes.UpdateGarageCodes.Success;
      }
    }

    return status;
  }
}
