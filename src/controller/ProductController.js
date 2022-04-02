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
      logger.info(`Retrieving data for product ${id}`);
      const product = await productDao.getById(id);
      if (product && product.length != 0) {
        return res.json(product);
      } else {
        return res.json({ error: 'Product not found' });
      }
    } else {
      logger.info(`Retrieving data for all products`);
      const products = await productDao.getAll();
      return res.json(products);
    }
  };

  addNewProduct = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    logger.info(req.file);
    let product;
    const { title, price } = req.body;
    const thumbnail = req.file.filename;
    const timestamp = Date.now();
    logger.info({ title, price, thumbnail });
    logger.info(`Creating new product ${(title, price, thumbnail, timestamp)}`);
    try {
      product = new Product(title, price, thumbnail, timestamp);
    } catch (error) {
      logger.error(error);
    }
    const newProduct = await productDao.save(
      JSON.parse(JSON.stringify(product))
    );
    if (newProduct) {
      logger.info(`Product created: ${newProduct}`);
      return res.json(newProduct);
    } else {
      return res.json({ error: 'Error on saving product' });
    }
  };

  updateProductById = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    if (config.isAdmin) {
      const id = req.params.id;
      console.log(id);
      const title = req.body.title;
      const price = Number(req.body.price);
      const thumbnail = req.file.filename;
      const timestamp = Date.now();
      const product = new Product(title, price, thumbnail, timestamp);
      logger.info(`Updating product`);
      const updatedProduct = await productDao.updateById(
        id,
        JSON.parse(JSON.stringify(product))
      );
      if (updatedProduct) {
        logger.info(`Product created: ${updatedProduct}`);
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
