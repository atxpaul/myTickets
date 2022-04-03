import MongoContainer from '../../containers/MongoContainer.js';

class OrderMongoDao extends MongoContainer {
  constructor() {
    super('orders', {
      customerId: { type: String, required: true },
      products: { type: Array, required: true },
      status: { type: String, required: true },
      timestamp: { type: Number, required: true },
    });
  }
}

export default OrderMongoDao;
