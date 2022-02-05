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

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error en servidor ${error}`));
