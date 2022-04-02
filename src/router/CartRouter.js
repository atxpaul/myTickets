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
    // this.router.post(
    //   '/',
    //   checkAuthentication,
    //   this.cartController.createNewCart
    // );
    this.router.post(
      '/',
      checkAuthentication,
      this.cartController.addProductsToCart
    );
    this.router.delete(
      '/:id',
      checkAuthentication,
      this.cartController.deleteCartById
    );
    this.router.get(
      '/:id/products',
      checkAuthentication,
      this.cartController.getProductsByCart
    );

    this.router.post(
      '/:id/order',
      checkAuthentication,
      this.cartController.createNewOrderFromCart
    );
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
