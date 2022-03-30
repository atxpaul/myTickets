import config from '../config/config.js';
import logger from '../config/logger.js';

function checkAdmin(req, res, next) {
  const username = req.user;
  logger.info(`Checking if ${username} is ${config.adminMail}`);
  if (username == config.adminMail) {
    next();
  } else {
    return res.status(401).json({
      error: 'not authorized',
    });
  }
}

export default checkAdmin;
