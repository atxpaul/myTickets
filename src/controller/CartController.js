import { cartDao } from '../dao/CartDaoFactory.js';
import { productDao } from '../dao/ProductDaoFactory.js';
import Mailer from '../jobs/Mailer.js';
import Whatsapper from '../jobs/Whatsapper.js';
import Sms from '../jobs/Sms.js';
import logger from '../config/logger.js';

class CartController {
  constructor() {}

  createNewCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const username = req.user.username;
    let id;
    if (username) {
      id = await cartDao.save({
        username: username,
        timestamp: Date.now(),
        products: [],
      });
    } else {
      logger.warn('Error creating cart because there is not username');
      return res.json({ error: 'Error on creating cart: Not username' });
    }

    if (id) {
      return res.json(id);
    } else {
      return res.json({ error: 'Error on creating cart' });
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

  addProductsToCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const id = req.params.id;
    const newProductId = req.body.productId;
    logger.warn(req.body);
    const cart = await cartDao.getById(id);
    const product = await productDao.getById(newProductId);
    logger.info(`Attempting to add ${newProductId} to ${id}`);
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
    const whatsapper = new Whatsapper();
    whatsapper.sendOrderNoticeToAdministrator(user);
    const sms = new Sms();
    sms.sendOrderNoticeToCustomer(user);
    res.json({ success: 'New order created for user' });
    try {
      await cartDao.deleteById(id);
    } catch (err) {
      logger.error(err);
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
