import logger from '../config/logger.js';
import upload from '../middleware/multer.js';
import passport from '../middleware/passport.js';
import checkAuthentication from '../middleware/checkAuthentication.js';
import UserController from '../controller/UserController.js';

class UserRouter {
  constructor(express) {
    this.express = express;
    this.router = this.express.Router();
    this.userController = new UserController();
  }

  start() {
    logger.info(`Starting Users Router`);
    this.router.post(
      '/login',
      passport.authenticate('login', {
        failureMessage: true,
      }),
      this.userController.postLogin
    );

    this.router.post(
      '/signup',
      upload.single('avatar'),
      passport.authenticate('signup', { failureMessage: true }),
      this.userController.postSignup
    );

    this.router.get('/login', this.userController.getLogin);
    this.router.get('/signup', this.userController.getSignup);
    this.router.get('/home', checkAuthentication, this.userController.getHome);
    this.router.get('/logout', this.userController.getLogout);
    this.router.get('/userimage/:image', this.userController.getImageFile);
    return this.router;
  }
}

export default UserRouter;
