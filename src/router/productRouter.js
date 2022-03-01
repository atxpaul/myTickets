import logger from '../config/logger.js';
import ProductController from '../controller/ProductController.js';

class ProductRouter {
  constructor(express) {
    this.express = express;
    this.router = this.express.Router();
    this.productController = new ProductController();
  }

  start() {
    logger.info(`Starting Products Router`);
    this.router.get('/:id?', this.productController.getProducts);
    this.router.post('/', this.productController.addNewProduct);
    this.router.put('/:id', this.productController.updateProductById);
    this.router.delete('/:id', this.productController.deleteProductById);
    return this.router;
  }
}

export default ProductRouter;
