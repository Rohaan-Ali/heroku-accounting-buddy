const dbWrapper = require("./db/DbWrapper");

dbWrapper.connect()
.then(() => {
    dbWrapper.updateSchemas("User");
    dbWrapper.updateSchemas("Garage");
    dbWrapper.updateSchemas("Car");
    dbWrapper.updateSchemas("Transaction");
})
.catch((err: any) => console.log(err));
