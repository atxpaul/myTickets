import parseArgs from 'minimist';
import os from 'os';

import app from './loader/app.js';

import mongoose from 'mongoose';
import config from './config/config.js';
import logger from './config/logger.js';

// const options = {
//   alias: {
//     m: 'mode',
//     c: 'cpu',
//   },
//   default: {
//     mode: 'fork',
//     cpu: os.cpus().length,
//   },
// };

// const commandLineArgs = process.argv.slice(2);

// const { mode, cpu, _ } = parseArgs(commandLineArgs, options);

async function connectServer() {
  const PORT = process.env.PORT || 8080;

  const server = app.listen(PORT, () => {
    try {
      mongoose.connect(config.mongodb.url, config.mongodb.options);
    } catch (err) {
      logger.error(err);
    }

    logger.info(
      `
      ###################################################
      🛡️  Server on PID ${process.pid} listening on port: ${
        server.address().port
      } 🛡️ 
      ###################################################
    `
    );
  });
  server.on('error', (error) => logger.error(`Error on server ${error}`));
}

connectServer();
