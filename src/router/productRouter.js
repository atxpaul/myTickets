import logger from '../config/logger.js';
import upload from '../middleware/multer.js';
import checkAdmin from '../middleware/checkAdmin.js';
import ProductController from '../controller/ProductController.js';
import checkAuthentication from '../middleware/checkAuthentication.js';

class ProductRouter {
  constructor(express) {
    this.express = express;
    this.router = this.express.Router();
    this.productController = new ProductController();
  }

  start() {
    logger.info(`Starting Products Router`);
    this.router.get('/:id?', this.productController.getProducts);
    this.router.post(
      '/',
      checkAuthentication,
      checkAdmin,
      upload.single('thumbnail'),
      this.productController.addNewProduct
    );
    this.router.put('/:id', this.productController.updateProductById);
    this.router.delete('/:id', this.productController.deleteProductById);
    this.router.get('/images/:image', this.productController.getImageFile);
    return this.router;
  }
}

export default ProductRouter;
