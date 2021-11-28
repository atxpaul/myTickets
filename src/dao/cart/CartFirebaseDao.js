import FirebaseContainer from '../../containers/FirebaseContainer.js';

class CartFirebaseDao extends FirebaseContainer {
  constructor() {
    super('carts');
  }
}

export default CartFirebaseDao;
