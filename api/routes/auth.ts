import express from "express";
const router = express.Router();
import Joi from "joi";

const User = require("../db/models/User");

router.post("/signup", (req, res) => {
  const result = validateUser(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error?.details[0].message);
    return;
  }

  res.status(200).json({
    success: true,
    user: req.body,
  });
});

function validateUser(user: any) {
  const schema = Joi.object({
    Name: Joi.string()
      .regex(
        /^[a-zA-Z ]*$/,
        "Name should only contains characters or whitespace"
      )
      .min(3)
      .max(50)
      .required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).max(50).required(),
  });

  return schema.validate(user);
}

module.exports = router;
