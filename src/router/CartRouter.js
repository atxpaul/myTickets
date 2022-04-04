import logger from '../config/logger.js';
import CartController from '../controller/CartController.js';
import checkAuthentication from '../middleware/checkAuthentication.js';

class CartRouter {
    constructor(express) {
        this.express = express;
        this.router = this.express.Router();
        this.cartController = new CartController();
    }

    start() {
        logger.info(`Starting Carts Router`);
        this.router.put(
            '/add',
            checkAuthentication,
            this.cartController.addOneProductUnitToCart
        );
        this.router.put(
            '/decrease',
            checkAuthentication,
            this.cartController.removeOneProductUnitFromCart
        );
        this.router.delete(
            '/products/:id_product',
            checkAuthentication,
            this.cartController.removeProductsFromCart
        );
        this.router.get('/', checkAuthentication, this.cartController.getCart);

        this.router.post(
            '/order',
            checkAuthentication,
            this.cartController.createNewOrderFromCart
        );
        return this.router;
    }
}

export default CartRouter;
