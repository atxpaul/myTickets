import passport from 'passport';
import bCrypt from 'bcrypt';
import LocalStrategy from 'passport-local';
import User from '../model/UserModel.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';
import config from '../config/config.js';

mongoose.connect(config.mongodb.url, config.mongodb.options);

passport.use(
  'signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      logger.info(`Registering user ${username}`);
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          logger.error(`Error in SignUp: ${err}`);
          return done(err);
        }

        if (user) {
          logger.error('User already exists');
          return done(null, false);
        }
        logger.info(`Creating user ${username} in database`);
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          address: req.body.address,
          age: Number(req.body.age),
          phone: req.body.phone,
          profilePic: req.file.path,
        };

        //logger.info(req.file.originalname);
        logger.info(newUser);
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
    logger.info(`Login user ${username}`);
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        logger.error('User Not Found with username ' + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        logger.error('Invalid Password');
        return done(null, false);
      }
      logger.info(`User ${username} logged`);
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

export default passport;
