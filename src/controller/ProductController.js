import { productDao } from '../dao/ProductDaoFactory.js';
import config from '../config/config.js';
import logger from '../config/logger.js';
import Product from '../model/Product.js';

class ProductController {
  constructor() {}

  getProducts = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    if (req.params.id) {
      const id = req.params.id;
      const product = await productDao.getById(id);
      if (product && product.length != 0) {
        return res.json(product);
      } else {
        return res.json({ error: 'Product not found' });
      }
    } else {
      const products = await productDao.getAll();
      return res.json(products);
    }
  };

  addNewProduct = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    if (config.isAdmin) {
      const { title, price, thumbnail } = req.body;
      const timestamp = Date.now();
      const product = new Product(title, price, thumbnail, timestamp);
      const id = await productDao.save(JSON.parse(JSON.stringify(product)));
      if (id) {
        return res.json(await productDao.getById(id));
      } else {
        return res.json({ error: 'Error on saving product' });
      }
    } else {
      return res.json({
        error: -1,
        description: 'route post method addNewProduct not authorized',
      });
    }
  };

  updateProductById = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    if (config.isAdmin) {
      const id = req.params.id;
      const { title, price, thumbnail } = req.body;
      const timestamp = Date.now();
      const product = new Product(title, price, thumbnail, timestamp);
      const updatedProduct = await productDao.updateById(
        id,
        JSON.parse(JSON.stringify(product))
      );
      if (updatedProduct) {
        return res.json(updatedProduct);
      } else {
        return res.json({ error: 'Error on saving product' });
      }
    } else {
      return res.json({
        error: -1,
        description: 'route put method updateProductById not authorized',
      });
    }
  };

  deleteProductById = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    if (config.isAdmin) {
      const id = req.params.id;
      logger.info(`Trying to delete product ${id}`);
      const productToDelete = await productDao.getById(id);
      if (productToDelete) {
        try {
          await productDao.deleteById(id);
        } catch (err) {
          logger.error(err);
        }

        return res.json(productToDelete);
      } else {
        return res.json({ error: 'Product to delete does not exists' });
      }
    } else {
      return res.json({
        error: -1,
        description: 'route delete method deleteProductById not authorized',
      });
    }
  };
}

export default ProductController;
