import { cartDao } from '../dao/CartDaoFactory.js';
import { productDao } from '../dao/ProductDaoFactory.js';
import Mailer from '../jobs/Mailer.js';
import logger from '../config/logger.js';
import Cart from '../model/Cart.js';

class CartController {
  constructor() {}

  addOneProductUnitToCart = async (req, res) => {
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

  removeOneProductUnitFromCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const customerId = req.user.id;
    const productId = req.body.productId;

    //1 - get cart 2 - get product 3 - remove product from cart
    let query = {};
    query['customerId'] = customerId;
    const cartStored = await cartDao.getByCustomQuery(query);
    const cart = new Cart(customerId, cartStored.products);
    cart.decreaseOneProduct(productId, cart.products);
    const newCart = await cartDao.updateById(
      cartStored.id,
      JSON.parse(JSON.stringify(cart))
    );
    return res.json(newCart);
  };

  removeProductsFromCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const customerId = req.user.id;
    const productId = req.params.id_product;

    //1 - get cart 2 - get product 3 - remove product from cart
    let query = {};
    query['customerId'] = customerId;
    const cartStored = await cartDao.getByCustomQuery(query);
    const cart = new Cart(customerId, cartStored.products);
    logger.info(productId);
    cart.removeProduct(productId);
    const newCart = await cartDao.updateById(
      cartStored.id,
      JSON.parse(JSON.stringify(cart))
    );
    return res.json(newCart);
  };

  getCart = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const customerId = req.user.id;

    let query = {};
    query['customerId'] = customerId;
    const cartStored = await cartDao.getByCustomQuery(query);
    if (cartStored) {
      return res.json(cartStored);
    } else {
      return res.json({});
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
    res.json({ success: 'New order created for user' });
    try {
      await cartDao.deleteById(id);
    } catch (err) {
      logger.error(err);
    }
  };
}

export default CartController;
