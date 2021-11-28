//TODO
import config from '../config/config.js';

let productDao, cartDao;

switch (config.storage) {
  case 'json':
    const { default: ProductFileDao } = await import(
      './product/ProductFileDao.js'
    );
    productDao = new ProductFileDao('.products');
    const { default: CartFileDao } = await import('./cart/CartFileDao.js');
    cartDao = new CartFileDao('.carts');
    break;
  case 'firebase':
    const { default: ProductFirebaseDao } = await import(
      './product/ProductFirebaseDao.js'
    );
    productDao = new ProductFirebaseDao();
    const { default: CartFirebaseDao } = await import(
      './cart/CartFirebaseDao.js'
    );
    cartDao = new CartFirebaseDao();
    break;
  case 'mongodb':
    const { default: ProductMongoDao } = await import(
      './product/ProductMongoDao.js'
    );
    productDao = new ProductMongoDao();
    const { default: CartMongoDao } = await import('./cart/CartMongoDao.js');
    cartDao = new CartMongoDao();
    break;
  default:
    const { default: ProductMemoryDao } = await import(
      './product/ProductMemoryDao.js'
    );
    productDao = new ProductMemoryDao();
    const { default: CartMemoryDao } = await import('./cart/CartMemoryDao.js');
    cartDao = new CartMemoryDao();
    break;
}

export { productDao, cartDao };
