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
    this.router.post('/', this.cartController.createNewCart);
    this.router.delete('/:id', this.cartController.deleteCartById);
    this.router.get('/:id/products', this.cartController.getProductsByCart);
    this.router.post('/:id/products', this.cartController.addProductsToCart);
    this.router.post('/:id/order', this.cartController.createNewOrderFromCart);
    this.router.delete(
      '/:id/products/:id_product',
      this.cartController.removeProductFromCartById
    );
    this.router.get(
      '/',
      checkAuthentication,
      this.cartController.getCartsByUser
    );
    return this.router;
  }
}

export default CartRouter;
