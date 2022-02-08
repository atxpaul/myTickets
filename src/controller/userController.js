import logger from '../config/logger.js';
import Mailer from '../jobs/Mailer.js';

class UserController {
  constructor() {}

  postLogin = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}s`);
    res.redirect('/');
  };

  postSignup = async (req, res) => {
    const { originalUrl, method } = req;
    const user = req.user;
    const mailer = new Mailer();
    logger.info(`Processing request: ${method}-${originalUrl}`);
    mailer.sendSignupNotification(user);
    //res.redirect('/login.html');
    res.status(200).json({ name: user.name, email: user.username });
  };

  getHome = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.username });
  };

  getLogin = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    res.redirect('/login.html');
  };

  getSignup = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    res.redirect('/signup.html');
  };

  postLogout = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    req.session.destroy();
    req.redirect('/logout.html');
  };

  userImage = async (req, res, next) => {
    logger.info(req.file);
    const file = req.file;
    if (!file) {
      const error = new Error(`Please, upload a file`);
      error.httpStatusCode = 400;
      res.send(error);
    }
    res.send(file);
  };
}

export default UserController;
