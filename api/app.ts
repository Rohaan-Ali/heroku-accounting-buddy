import express from "express";
import { GarageService } from "./services/GarageService";

const dbWrapper = require("./db/DbWrapper");
dbWrapper.connect();

const app = express();
// Body Parser
app.use(express.json());
// Routes
app.use("/auth", require("./routes/auth"));
app.use("/garage", require("./routes/garage"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server Started at ", port));

const garageService = new GarageService();
//const garageId = garageService.RegisterGarage();
//const garageId = garageService.FindWorker("rohaa@gmail.com");
