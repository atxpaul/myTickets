import MongoContainer from '../../containers/MongoContainer.js';

class CartMongoDao extends MongoContainer {
    constructor() {
        super('carts', {
            customerId: { type: String, required: true },
            products: { type: Array },
        });
    }
}

export default CartMongoDao;
