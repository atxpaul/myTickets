import express from 'express';

import upload from '../middleware/multer.js';
import passport from '../middleware/passport.js';
import checkAuthentication from '../middleware/checkAuthentication.js';
import controller from '../controller/UserController.js';

const { Router } = express;
const router = new Router();

const userController = new controller();

router.post(
  '/login',
  passport.authenticate('login', {
    failureMessage: true,
  }),
  userController.postLogin
);

router.post(
  '/signup',
  upload.single('avatar'),
  passport.authenticate('signup', { failureMessage: true }),
  userController.postSignup
);

router.get('/login', userController.getLogin);
router.get('/signup', userController.getSignup);
router.get('/home', checkAuthentication, userController.getHome);
router.get('/logout', userController.getLogout);
router.get('/userimage/:image', userController.getImageFile);

export default router;
