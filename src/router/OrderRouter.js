import logger from '../config/logger.js';
import OrderController from '../controller/OrderController.js';
import checkAuthentication from '../middleware/checkAuthentication.js';

class OrderRouter {
    constructor(express) {
        this.express = express;
        this.router = this.express.Router();
        this.orderController = new OrderController();
    }

    start() {
        logger.info(`Starting Orders Router`);
        this.router.get(
            '/:id?',
            checkAuthentication,
            this.orderController.getOrders
        );
        return this.router;
    }
}

export default OrderRouter;
