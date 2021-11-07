import container from '../persistence/container.js';
import config from '../config/config.js';

class ProductController {
  constructor() {}

  async getProducts(req, res) {
    const storage = new container('.products');
    if (req.params.id) {
      const id = req.params.id;
      const product = await storage.getById(id);
      if (product && product.length != 0) {
        return res.json(product);
      } else {
        return res.json({ error: 'Product not found' });
      }
    } else {
      const products = await storage.getAll();
      return res.json(products);
    }
  }

  async addNewProduct(req, res) {
    if (config.isAdmin) {
      const storage = new container('.products');
      const product = req.body;
      product.timestamp = Date.now();
      const id = await storage.save(product);
      if (id) {
        return res.json(await storage.getById(id));
      } else {
        return res.json({ error: 'Error on saving product' });
      }
    } else {
      return res.json({
        error: -1,
        description: 'route post method addNewProduct not authorized',
      });
    }
  }

  async updateProductById(req, res) {
    if (config.isAdmin) {
      const storage = new container('.products');
      const id = Number(req.params.id);
      const product = req.body;
      const updatedProduct = await storage.updateById(id, product);
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
  }

  async deleteProductById(req, res) {
    if (config.isAdmin) {
      const storage = new container('.products');
      const id = Number(req.params.id);
      const productToDelete = await storage.getById(id);
      if (productToDelete) {
        await storage.deleteById(id);
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
  }
}

export default ProductController;
