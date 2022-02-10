import logger from '../config/logger.js';
import Mailer from '../jobs/Mailer.js';
import fs from 'fs';
import path from 'path';

class UserController {
  constructor() {}

  postLogin = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    res.redirect('/home.html');
  };

  postSignup = async (req, res) => {
    const { originalUrl, method } = req;
    const user = req.user;
    const mailer = new Mailer();
    logger.info(`Processing request: ${method}-${originalUrl}`);
    mailer.sendSignupNotification(user);
    res.redirect('/');
  };

  getHome = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const user = req.user;
    logger.info(`Sending user data ${user}`);
    res.status(200).json({ user });
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

  getLogout = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    req.session.destroy();
    res.redirect('/logout.html');
  };

  getImageFile = async (req, res) => {
    const file = req.params.image;
    const pathFile = './uploads/' + file;
    logger.info(`Trying to get image ${pathFile}`);
    let fileExists = fs.existsSync(pathFile);
    if (fileExists) {
      logger.info(`Sending image`);
      return res.sendFile(path.resolve(pathFile));
    } else {
      logger.warn(`Image ${pathFile} not found!`);
      return res.status(404).send({
        message: 'File does not exists',
      });
    }
  };
}

export default UserController;
