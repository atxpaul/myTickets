import express from 'express';

import controller from '../controller/CartController.js';

const { Router } = express;
const router = new Router();

const cartController = new controller();

router.post('/', cartController.createNewCart);
router.delete('/:id', cartController.deleteCartById);
router.get('/:id/products', cartController.getProductsByCart);
router.post('/:id/products', cartController.addProductsToCart);
router.delete(
  '/:id/products/:id_product',
  cartController.removeProductFromCartById
);

export default router;
