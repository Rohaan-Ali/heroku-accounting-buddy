import express from "express";

const dbWrapper = require("./db/DbWrapper");
dbWrapper.connect();

const app = express();
// Body Parser
app.use(express.json());
// Routes
app.use("/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server Started at ", port));
