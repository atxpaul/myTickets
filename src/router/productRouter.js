import express from 'express';

import controller from '../controller/ProductController.js';

const { Router } = express;
const router = new Router();

const productController = new controller();

router.get('/:id?', productController.getProducts);
router.post('/', productController.addNewProduct);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);

export default router;
