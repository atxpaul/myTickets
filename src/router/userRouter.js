import express from 'express';
import passport from '../middleware/Passport.js';
import session from 'express-session';
import mongoose from 'mongoose';

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
  passport.authenticate('login', { failureRedirect: '/faillogin' }),
  userController.login
);

export default router;
