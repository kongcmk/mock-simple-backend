const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, callback) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return callback(null, user, { message: "Logged in successfully" });
        } else {
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
      } catch (error) {
        return callback(error);
      }
    }
  )
);

passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  