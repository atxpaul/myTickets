import container from '../persistence/container.js';

class CartController {
  constructor() {
    this.storage = new container('.carts');
    this.products = new container('.products');
  }

  createNewCart = async (req, res) => {
    const id = await this.storage.save({ timestamp: Date.now(), products: [] });
    if (id) {
      return res.json(id);
    } else {
      return res.json({ error: 'Error on creating cart' });
    }
  };

  deleteCartById = async (req, res) => {
    const id = Number(req.params.id);
    const cartToDelete = await this.storage.getById(id);
    if (cartToDelete) {
      await storage.deleteById(id);
      return res.json(cartToDelete);
    } else {
      return res.json({ error: 'Product to delete does not exists' });
    }
  };

  getProductsByCart = async (req, res) => {
    const id = Number(req.params.id);

    const cartContent = await this.storage.getById(id);
    const cartProductsId = cartContent.products;

    const cartProductsDetailed = [];
    for (let i = 0; i < cartProductsId.length; i++) {
      const product = await this.products.getById(cartProductsId[i]);
      cartProductsDetailed.push(product);
    }

    return res.json(cartProductsDetailed);
  };

  addProductsToCart = async (req, res) => {
    const id = Number(req.params.id);
    const newProductId = Number(req.body.productId);
    const cart = await this.storage.getById(id);
    const product = await this.products.getById(newProductId);
    console.log(newProductId, product);

    if (product.id) {
      if (cart.products) {
        cart.products.push(newProductId);
      } else {
        cart.products = newProductId;
      }

      const newCart = await this.storage.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'No products were added' });
    }
  };

  removeProductFromCartById = async (req, res) => {
    const id = Number(req.params.id);
    const productIdToDelete = Number(req.params.id_product);
    const cart = await this.storage.getById(id);

    if (cart.products) {
      let index = cart.products.indexOf(productIdToDelete);
      if (index > -1) cart.products.splice(index, 1);
      const newCart = await this.storage.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'Cart was already empty' });
    }
  };
}

export default CartController;
