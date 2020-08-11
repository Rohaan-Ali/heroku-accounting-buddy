const Garage = require("../db/models/Garage");

export class GarageService {
  RegisterGarage() {
    const newGarage = Garage.build({
      Name: "Garage1",
      Address: "Address1",
      BusinessNumber: "15648631",
    });

    newGarage.save();
  }
  FindWorker(email: string): Number {
    let garageId = 0;

    const garages = Garage.findAll({
      attributes: ["Id", "Workers"],
    });

    console.log(garages);

    return garageId;
  }
}
