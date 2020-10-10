import { Request } from "express";

const jwt = require("jsonwebtoken");

export function DecodeJwtToken(req: Request): any {
  let authorization = req.headers.authorization?.toString() || "";
  let authorizationArray = authorization.split(" ");
  const token = authorizationArray[1];

  if (token != "") {
    var decodedToken = jwt.decode(token, { complete: true });
    return decodedToken;
  }
}
