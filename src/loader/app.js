import express from 'express';
import ProductRouter from '../router/ProductRouter.js';
import CartRouter from '../router/CartRouter.js';
import UserRouter from '../router/UserRouter.js';

import session from 'express-session';
import passport from '../middleware/passport.js';

import config from '../config/config.js';
import logger from '../config/logger.js';

const app = express();

const productRouter = new ProductRouter(express);
const cartRouter = new CartRouter(express);
const userRouter = new UserRouter(express);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productRouter.start());
app.use('/api/cart', cartRouter.start());
app.use('/api/users', userRouter.start());
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

export default app;
