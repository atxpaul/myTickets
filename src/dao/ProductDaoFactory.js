import config from '../config/config.js';

let productDao;

switch (config.storage) {
  case 'json':
    const { default: ProductFileDao } = await import(
      './product/ProductFileDao.js'
    );
    productDao = new ProductFileDao('.products');
    break;
  case 'firebase':
    const { default: ProductFirebaseDao } = await import(
      './product/ProductFirebaseDao.js'
    );
    productDao = new ProductFirebaseDao();
    break;
  case 'mongodb':
    const { default: ProductMongoDao } = await import(
      './product/ProductMongoDao.js'
    );
    productDao = new ProductMongoDao();
    break;
  default:
    const { default: ProductMemoryDao } = await import(
      './product/ProductMemoryDao.js'
    );
    productDao = new ProductMemoryDao();
    break;
}

export { productDao };
