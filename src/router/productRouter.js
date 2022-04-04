import logger from '../config/logger.js';
import upload from '../middleware/multer.js';
import checkAdmin from '../middleware/checkAdmin.js';
import checkAuthentication from '../middleware/checkAuthentication.js';
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
        this.router.post(
            '/',
            checkAuthentication,
            checkAdmin,
            upload.single('thumbnail'),
            this.productController.addNewProduct
        );
        this.router.put(
            '/:id',
            checkAuthentication,
            checkAdmin,
            upload.single('thumbnail'),
            this.productController.updateProductById
        );
        this.router.delete(
            '/:id',
            checkAuthentication,
            checkAdmin,
            this.productController.deleteProductById
        );

        this.router.use('/static', this.express.static('uploads'));

        return this.router;
    }
}

export default ProductRouter;
