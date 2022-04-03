import Order from '../model/Order.js';
import { orderDao } from '../dao/OrderDaoFactory.js';
import { productDao } from '../dao/ProductDaoFactory.js';
import Mailer from '../jobs/Mailer.js';
import logger from '../config/logger.js';

class OrderService {
  constructor() {}

  createNewOrder = async (customerId, products, username) => {
    const order = new Order(customerId, products);
    let newOrder;
    try {
      newOrder = await orderDao.save(order);
    } catch (err) {
      logger.error(err);
    }
    let listOfProductsForNewOrder = [];
    for (let product of products) {
      let soldProduct = await productDao.getById(product.productId);

      let productTransformed = {
        title: soldProduct.title,
        price: soldProduct.price,
        quantity: product.quantity,
      };
      listOfProductsForNewOrder.push(productTransformed);
    }
    const mailer = new Mailer();
    mailer.sendNewOrderNotification(username, listOfProductsForNewOrder);

    return newOrder;
  };
}

export default OrderService;
