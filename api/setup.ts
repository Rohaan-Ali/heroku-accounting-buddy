const dbWrapper = require("./db/DbWrapper");

dbWrapper.connect();
dbWrapper.updateSchemas("User");
dbWrapper.updateSchemas("Garage");
dbWrapper.updateSchemas("Car");
dbWrapper.updateSchemas("Transaction");
