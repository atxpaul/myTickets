import express from 'express';
import bCrypt from 'bcrypt';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import config from '../config/config.js';
import User from '../model/UserModel.js';

const { Router } = express;
const router = new Router();

router.use(session(config.session));
router.use(passport.initialize());
router.use(passport.session());

//MIDDLEWARE
passport.use(
  'signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      logger.info(`Registrando usuario ${username}`);
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          logger.error(`Error in SignUp: ${err}`);
          return done(err);
        }

        if (user) {
          logger.error('User already exists');
          return done(null, false);
        }

        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
        };

        User.create(newUser, (err, userWithId) => {
          if (err) {
            logger.error(`Error in saving user: ${err}`);
            return done(err);
          }
          logger.info(`User registration succesful ${user}`);
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.use(
  'login',
  new LocalStrategy((username, password, done) => {
    logger.info(`Login del usuario ${username}`);
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        logger.error('User Not Found with username ' + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        logger.error('Invalid Password');
        return done(null, false);
      }

      return done(null, user);
    });
  })
);

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

passport.serializeUser((user, done) => {
  done(null, user._id);
});

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

export default router;
