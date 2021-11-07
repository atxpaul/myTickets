import container from '../persistence/container.js';

class CartController {
  constructor() {}

  async createNewCart(req, res) {
    const storage = new container('.carts');
    const id = await storage.save({ timestamp: Date.now() });
    if (id) {
      return res.json(id);
    } else {
      return res.json({ error: 'Error on creating cart' });
    }
  }

  async deleteCartById(req, res) {
    const storage = new container('.carts');
    const id = Number(req.params.id);
    const cartToDelete = await storage.getById(id);
    if (cartToDelete) {
      await storage.deleteById(id);
      return res.json(cartToDelete);
    } else {
      return res.json({ error: 'Product to delete does not exists' });
    }
  }

  async getProductsByCart(req, res) {
    const storage = new container('.carts');
    const products = new container('.products');

    const id = Number(req.params.id);

    const cartContent = await storage.getById(id);
    const cartProductsId = cartContent.products;

    const cartProductsDetailed = [];
    for (let i = 0; i < cartProductsId.length; i++) {
      const product = await products.getById(cartProductsId[i]);
      cartProductsDetailed.push(product);
    }

    return res.json(cartProductsDetailed);
  }

  async addProductsToCart(req, res) {
    const storage = new container('.carts');

    const id = Number(req.params.id);
    const newProductsId = req.body;
    const cart = await storage.getById(id);

    if (newProductsId.length > 0) {
      if (cart.products) {
        cart.products.push(...newProductsId);
      } else {
        cart.products = newProductsId;
      }

      const newCart = await storage.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'No products were added' });
    }
  }

  async removeProductFromCartById(req, res) {
    const storage = new container('.carts');

    const id = Number(req.params.id);
    const productIdToDelete = Number(req.params.id_product);
    const cart = await storage.getById(id);

    if (cart.products) {
      let index = cart.products.indexOf(productIdToDelete);
      if (index > -1) cart.products.splice(index, 1);
      const newCart = await storage.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'Cart was already empty' });
    }
  }
}

export default CartController;
