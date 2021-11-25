import FileContainer from '../../containers/FileContainer.js';

class ProductFileDao extends FileContainer {
  constructor() {
    super('.products');
  }
}

export default ProductFileDao;
