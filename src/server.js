import parseArgs from 'minimist';
import os from 'os';

import { httpServer } from './loader/app.js';
import Mongo from './loader/Mongo.js';

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

  const connectedServer = httpServer.listen(PORT, async () => {
    const mongo = new Mongo();
    await mongo.connectDb();

    logger.info(
      `
      ###################################################
      🛡️  Server on PID ${process.pid} listening on port: ${
        connectedServer.address().port
      } 🛡️ 
      ###################################################
    `
    );
  });
  connectedServer.on('error', (error) =>
    logger.error(`Error on server ${error}`)
  );
}

connectServer();
