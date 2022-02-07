import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import upload from '../middleware/multer.js';
import passport from '../middleware/passport.js';
import checkAuthentication from '../middleware/checkAuthentication.js';
import controller from '../controller/UserController.js';
import config from '../config/config.js';

const { Router } = express;
const router = new Router();

router.use(session(config.session));
router.use(passport.initialize());
router.use(passport.session());

const userController = new controller();

mongoose.connect(config.mongodb.url, config.mongodb.options);

router.post(
  '/login',
  passport.authenticate('login', {
    failureMessage: true,
  }),
  userController.login
);

router.post(
  '/signup',
  passport.authenticate('signup', { failureMessage: true }),
  userController.signup
);

router.post('/image', upload.single('avatar'), userController.userImage);

router.get('/home', checkAuthentication, userController.home);

export default router;
