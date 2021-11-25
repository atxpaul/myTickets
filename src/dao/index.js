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
  //   case 'firebase':
  //     const { default: PersonasDaoFirebase } = await import(
  //       './PersonasDaoFirebase.js'
  //     );
  //     personasDao = new PersonasDaoFirebase();
  //     break;
  //   case 'mongodb':
  //     const { default: PersonasDaoMongoDb } = await import(
  //       './PersonasDaoMongoDb.js'
  //     );
  //     personasDao = new PersonasDaoMongoDb();
  //     break;
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
