import FileContainer from '../../containers/FileContainer.js';

class CartFileDao extends FileContainer {
  constructor() {
    super('.carts');
  }
}

export default CartFileDao;
