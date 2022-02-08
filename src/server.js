import express from 'express';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';

import productRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';
import userRouter from './router/userRouter.js';

import logger from './config/logger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', userRouter);
app.use(express.static('public'));

app.use((req, res) => {
  const { url, method } = req;
  if (url != '/favicon.ico') {
    logger.warn(`Route ${method}-${url} not implemented`);
  }
  res.json({
    error: -2,
    description: `Route ${req.url} not implemented`,
  });
});

const options = {
  alias: {
    m: 'mode',
    c: 'cpu',
  },
  default: {
    mode: 'fork',
    cpu: os.cpus().length,
  },
};

const commandLineArgs = process.argv.slice(2);

const { mode, cpu, _ } = parseArgs(commandLineArgs, options);

function connectServer() {
  const PORT = process.env.PORT || 8080;

  const server = app.listen(PORT, () => {
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

if (mode === 'cluster') {
  if (cluster.isPrimary) {
    logger.info(`Starting instancies on ${cpu} CPUs`);
    logger.info(`PID MASTER ${process.pid}`);

    for (let i = 0; i < cpu; i++) {
      logger.info(`Starting worker on CPU ${i + 1}`);
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      logger.warn(
        'Worker',
        worker.process.pid,
        'died',
        new Date().toLocaleString()
      );
      cluster.fork();
    });
  }
} else {
  connectServer();
}
