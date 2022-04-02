import { cartDao } from '../dao/CartDaoFactory.js';
import { productDao } from '../dao/ProductDaoFactory.js';
import Mailer from '../jobs/Mailer.js';
import logger from '../config/logger.js';
import Cart from '../model/Cart.js';

class CartController {
  constructor() {}

  addProductsToCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);

    const customerId = req.user.id;
    const productId = req.body.productId;

    //1 - get cart 2 - get product 3 - add product to cart

    let query = {};
    query['customerId'] = customerId;
    const cartStored = await cartDao.getByCustomQuery(query);
    const product = await productDao.getById(productId);
    logger.info(`Attempting to add ${productId} to ${cartStored}`);
    if (!cartStored && product) {
      const cart = new Cart(customerId);
      cart.addOneProduct(productId, cart.products);
      const newCart = await cartDao.save(JSON.parse(JSON.stringify(cart)));
      return res.json(newCart);
    } else if (cartStored && product) {
      const cart = new Cart(customerId, cartStored.products);
      console.log('Cart stored');
      console.log(cartStored.products);
      cart.addOneProduct(productId, cart.products);
      const newCart = await cartDao.updateById(
        cartStored.id,
        JSON.parse(JSON.stringify(cart))
      );
      return res.json(newCart);
    } else {
      return res.json({ error: 'No products were added' });
    }
  };

  removeProductFromCartById = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const id = req.params.id;
    const productIdToDelete = req.params.id_product;
    const cart = await cartDao.getById(id);

    if (cart.products) {
      let index = cart.products.indexOf(productIdToDelete);
      if (index > -1) {
        cart.products.splice(index, 1);
        const newCart = await cartDao.updateById(id, cart);
        return res.json(newCart);
      } else {
        res.json({ error: 'Product did not exist in cart' });
      }
    } else {
      res.json({ error: 'Cart was already empty' });
    }
  };

  deleteCartById = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const id = req.params.id;
    const cartToDelete = await cartDao.getById(id);
    if (cartToDelete) {
      await cartDao.deleteById(id);
      return res.json(cartToDelete);
    } else {
      return res.json({ error: 'Cart to delete does not exists' });
    }
  };

  getProductsByCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    let cartProductsId;
    const id = req.params.id;

    const cartContent = await cartDao.getById(id);
    if (cartContent) {
      cartProductsId = cartContent.products;
    } else {
      return res.json({
        error: 'Cart does not exists or does not have products',
      });
    }

    const cartProductsDetailed = [];
    for (let i = 0; i < cartProductsId.length; i++) {
      const product = await productDao.getById(cartProductsId[i]);
      cartProductsDetailed.push(product);
    }

    return res.json(cartProductsDetailed);
  };

  createNewOrderFromCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const id = req.params.id;
    const user = req.user;
    let soldProduct;
    if (!user) {
      res.json({ error: 'No user is logged' });
    }
    const cart = await cartDao.getById(id);
    let listOfProductsForNewOrder = [];
    for (let product of cart.products) {
      soldProduct = await productDao.getById(product);

      let productTransformed = {
        title: soldProduct.title,
        price: soldProduct.price,
      };
      listOfProductsForNewOrder.push(productTransformed);
    }
    const mailer = new Mailer();
    mailer.sendNewOrderNotification(user, listOfProductsForNewOrder);
    res.json({ success: 'New order created for user' });
    try {
      await cartDao.deleteById(id);
    } catch (err) {
      logger.error(err);
    }
  };

  //TD -> We need to improve this function for filtering by user instead use getAll
  //We assume that there will be only 1 cart per user. Cart will be deleted after creating order.
  getCartsByUser = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const username = req.user.username;
    logger.info(`Recovering cart for user ${username}`);

    const carts = await cartDao.getAll();
    let id;
    for (let cart of carts) {
      if (cart.username == username) {
        id = cart.id;
      }
    }
    logger.info(`Recovering cart ${id}`);
    res.json(id);
  };
}

export default CartController;
