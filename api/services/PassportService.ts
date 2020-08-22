import { Request } from "express";

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../db/models/User");
const Keys = require("../config/keys");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Keys.PassportSecretKey,
};

const jwtStrategy = new JwtStrategy(options, (payload: any, done: any) => {
  //console.log("payload : ", payload);
  User.findOne({ UserId: payload.UserId, IsActive: true, IsDeleted: false })
    .then((user: any) => {
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err: any) => done(err, null));
});

// Passport Jwt Strategy
module.exports = function (passport: any) {
  passport.use(jwtStrategy);

  passport.serializeUser((user: any, done: any) => {
    done(null, user.UserId);
  });

  passport.deserializeUser((UserId: any, done: any) => {
    User.findById(UserId, (err: any, user: any) => {
      done(err, user);
    });
  });
};
