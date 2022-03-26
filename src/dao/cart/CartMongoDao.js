import MongoContainer from '../../containers/MongoContainer.js';

class CartMongoDao extends MongoContainer {
  constructor() {
    super('carts', {
      username: { type: String, required: true },
      timestamp: { type: Number, required: true },
      products: { type: Array },
    });
  }
}

export default CartMongoDao;
