import { cartDao, productDao } from '../dao/index.js';

class CartController {
  constructor() {}

  createNewCart = async (req, res) => {
    const id = await cartDao.save({ timestamp: Date.now(), products: [] });
    if (id) {
      return res.json(id);
    } else {
      return res.json({ error: 'Error on creating cart' });
    }
  };

  deleteCartById = async (req, res) => {
    const id = req.params.id;
    const cartToDelete = await cartDao.getById(id);
    if (cartToDelete) {
      await cartDao.deleteById(id);
      return res.json(cartToDelete);
    } else {
      return res.json({ error: 'Product to delete does not exists' });
    }
  };

  getProductsByCart = async (req, res) => {
    const id = req.params.id;

    const cartContent = await cartDao.getById(id);
    const cartProductsId = cartContent.products;

    const cartProductsDetailed = [];
    for (let i = 0; i < cartProductsId.length; i++) {
      const product = await productDao.getById(cartProductsId[i]);
      cartProductsDetailed.push(product);
    }

    return res.json(cartProductsDetailed);
  };

  addProductsToCart = async (req, res) => {
    const id = req.params.id;
    const newProductId = req.body.productId;
    const cart = await cartDao.getById(id);
    const product = await productDao.getById(newProductId);
    console.log(newProductId, product);

    if (product.id) {
      if (cart.products) {
        cart.products.push(newProductId);
      } else {
        cart.products = newProductId;
      }

      const newCart = await cartDao.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'No products were added' });
    }
  };

  removeProductFromCartById = async (req, res) => {
    const id = req.params.id;
    const productIdToDelete = req.params.id_product;
    const cart = await cartDao.getById(id);

    if (cart.products) {
      let index = cart.products.indexOf(productIdToDelete);
      if (index > -1) cart.products.splice(index, 1);
      const newCart = await cartDao.updateById(id, cart);
      return res.json(newCart);
    } else {
      res.json({ error: 'Cart was already empty' });
    }
  };
}

export default CartController;
