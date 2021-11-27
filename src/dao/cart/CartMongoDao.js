import MongoContainer from '../../containers/MongoContainer.js';

class CartMongoDao extends MongoContainer {
  constructor() {
    super('carts', {
      timestamp: { type: Number, required: true },
      products: { type: Array },
    });
  }
}

export default CartMongoDao;
