import logger from '../config/logger.js';

class UserController {
  constructor() {}

  login = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
  };

  signup = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
  };

  home = async (req, res) => {
    const user = req.user;
    res.status(200).json({ name: user.name, email: user.email });
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
