import FirebaseContainer from '../../containers/FirebaseContainer.js';

class ProductFirebaseDao extends FirebaseContainer {
  constructor() {
    super('products');
  }
}

export default ProductFirebaseDao;
