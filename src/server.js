import express from 'express';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';

import productRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.use((req, res) => {
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
    console.log(
      `Server on PID ${process.pid} listening on port ${server.address().port}`
    );
  });
  server.on('error', (error) => console.log(`Error on server ${error}`));
}

if (mode === 'cluster') {
  if (cluster.isPrimary) {
    console.log(`Starting instancies on ${cpu} CPUs`);
    console.log(`PID MASTER ${process.pid}`);

    for (let i = 0; i < cpu; i++) {
      console.log(`Starting worker on CPU ${i + 1}`);
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(
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
