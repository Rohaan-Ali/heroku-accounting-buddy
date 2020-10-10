import { Request } from "express";
import { Worker } from "../models/Worker";
import { GarageDetail } from "../models/response/GarageDetail";

const Garage = require("../db/models/Garage");
const User = require("../db/models/User");
const StatusCodes = require("../config/StatusCodes");
const RoleCD = require("../config/RoleCD");

export class GarageService {
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
  // Get garage details
  async GetGarageDetails(GarageId: number): Promise<any> {
    let garageDetail = new GarageDetail();

    const garage = await await Garage.findByPk(GarageId);
    if (garage !== null) {
      garageDetail.Address = garage.Address;
      garageDetail.BusinessNumber = garage.BusinessNumber;
      garageDetail.Name = garage.Name;
      garageDetail.GarageId = garage.GarageId;
      garageDetail.IsActive = garage.IsActive;
      garageDetail.IsDeleted = garage.IsDeleted;
      return garageDetail;
    }

    return null;
  }
  async OffboardGarage(GarageId: number): Promise<Number> {
    let status = 0;

    const garage = await Garage.findOne({
      where: { Id: GarageId, IsDeleted: false, IsActive: true },
    });
    if (garage === null) {
      status = StatusCodes.OffboardGarage.GarageNotFound;
    } else {
      try {
        await sequelize.transaction(async (transaction: any) => {
          // Step 1: Find users where garage id = GarageId
          // Step 2: Update all these users GarageId to null and role to unassigned
          // Step 3: Soft delete Garage from DB
          // Todo: Need to confirm with Muhammad Qureshi that should we disable user accounts or not

          const garageUsers = await User.findAll({
            where: { GarageId: GarageId },
          });

          garageUsers.forEach(async (user: any) => {
            const dbUser = user.get({ plain: true });
            console.log("DbUser : ", dbUser);
            if (dbUser) {
              await User.update(
                { RoleCD: RoleCD.Roles.Unassigned, GarageId: null },
                {
                  where: {
                    Email: dbUser.Email,
                  },
                },
                { transaction: transaction }
              );
            }
          });

          await Garage.update(
            { IsActive: false, IsDeleted: true, Workers: null },
            {
              where: {
                Id: GarageId,
              },
            },
            { transaction: transaction }
          );
        });
        status = StatusCodes.OffboardGarage.Success;
      } catch (error) {
        console.log("Error: ", error);
        status = StatusCodes.OffboardGarage.Failure;
      }
    }

    return status;
  }
  // Get all worker of garage using garage id
  async GetGarageWorkers(GarageId: Number): Promise<any> {
    let workers = new Array<Worker>();

    const garage = await Garage.findOne({
      where: { Id: GarageId, IsDeleted: false, IsActive: true },
    });
    if (garage != null && garage.Workers != null) {
      workers = JSON.parse(garage.Workers);
    }

    return workers;
  }
}
