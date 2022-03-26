import MongoContainer from '../../containers/MongoContainer.js';

class ProductMongoDao extends MongoContainer {
  constructor() {
    super('products', {
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      thumbnail: { type: String, required: true },
      timestamp: { type: Number, required: true },
    });
  }
}

export default ProductMongoDao;
