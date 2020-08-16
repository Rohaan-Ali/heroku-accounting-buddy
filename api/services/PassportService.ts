const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../db/models/User");
const Keys = require("../config/keys");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Keys.PassportSecretKey,
};

const jwtStrategy = new JwtStrategy(options, (req: any, done: any) => {
  const { UserId } = req;
  User.findOne({ UserId: UserId })
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
};
