import express from 'express';
import { engine } from 'express-handlebars';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import ProductRouter from '../router/ProductRouter.js';
import CartRouter from '../router/CartRouter.js';
import UserRouter from '../router/UserRouter.js';
import OrderRouter from '../router/OrderRouter.js';
import MessageSocketRouter from '../router/MessageSocketRouter.js';
import getInfo from '../utils/getInfo.js';
import session from 'express-session';
import passport from '../middleware/passport.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

const app = express();

const productRouter = new ProductRouter(express);
const cartRouter = new CartRouter(express);
const userRouter = new UserRouter(express);
const orderRouter = new OrderRouter(express);

const info = getInfo();

const specs = swaggerJsdoc(config.swagger);

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: process.cwd() + '/views/layouts',
        partialsDir: process.cwd() + '/views/partials/',
    })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.set('view engine', 'hbs');
app.set('views', './views');
app.get('/info', (req, res) => {
    res.render('info.hbs', { info: info });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('uploads'));

app.use('/api/products', productRouter.start());
app.use('/api/carts', cartRouter.start());
app.use('/api/users', userRouter.start());
app.use('/api/orders', orderRouter.start());

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

const httpServer = new HttpServer(app);

const io = new Socket(httpServer);

const messageSocketRouter = new MessageSocketRouter(io);

messageSocketRouter.startRouter();

export { httpServer, app };
