import MongoContainer from '../../containers/MongoContainer.js';

class ProductMongoDao extends MongoContainer {
    constructor() {
        super('products', {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            timestamp: { type: Number, required: true },
        });
    }
}

export default ProductMongoDao;
