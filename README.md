# accounting-buddy
This is the app for managing garages.

## Environment Setup
You have to install following softwares to run application locally:
#### API:
1. Node js 12.18.1 or later ( https://nodejs.org/en/download/ )
2. PostgreSQL 12 or later ( https://www.postgresql.org/download/windows/ )
3. Postman to call APIs
#### APP:
Will provide update when start working on application.

## Running API project for first time
- Create database with 'AccountingBuddy' name by going into pgAdmin panel.
- Update username and password in database.ts with yours.
- ```npm run build```
- ```npm start```
- Load database tables:
  - In app.ts, uncomment dbWrapper.updateSchemas("Garage");
  - Change parameter in above method to "Garage", "User", "Car" and "Transaction" one by one and start/stop application everytime to load tables
- After this you can put APIs in postman and call them. I will also provide screenshot in trello tickets.
