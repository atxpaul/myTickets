import { orderDao } from '../dao/OrderDaoFactory.js';
import logger from '../config/logger.js';

class OrderController {
  constructor() {}

  getOrders = async (req, res) => {
    const { originalUrl, method } = req;
    logger.info(`Processing request: ${method}-${originalUrl}`);
    const customerId = req.user.id;
    let query = {};
    query['customerId'] = customerId;

    if (req.params.id) {
      const id = req.params.id;
      query['_id'] = id;
      logger.info(`Retrieving data for order ${id}`);
      const order = await orderDao.getByCustomQuery(query);
      if (order && order.length != 0) {
        return res.json(order);
      } else {
        return res.json({ error: 'Order not found' });
      }
    } else {
      logger.info(`Retrieving data for all orders`);
      const orders = await orderDao.getAllByCustomQuery(query);
      return res.json(orders);
    }
  };
}

export default OrderController;
