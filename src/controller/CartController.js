import { cartDao } from '../dao/CartDaoFactory.js';
import { productDao } from '../dao/ProductDaoFactory.js';
import logger from '../config/logger.js';
import Cart from '../model/Cart.js';
import OrderService from '../service/OrderService.js';

class CartController {
    constructor() {}

    addOneProductUnitToCart = async (req, res) => {
        const { originalUrl, method } = req;
        logger.info(`Processing request: ${method}-${originalUrl}`);

        const customerId = req.user.id;
        const productId = req.body.productId;

        //1 - get cart 2 - get product 3 - add product to cart

        let query = {};
        query['customerId'] = customerId;
        const cartStored = await cartDao.getByCustomQuery(query);
        const product = await productDao.getById(productId);
        logger.info(`Attempting to add ${productId} to ${cartStored}`);
        if (!cartStored && product) {
            const cart = new Cart(customerId);
            cart.addOneProduct(productId, cart.products);
            const newCart = await cartDao.save(
                JSON.parse(JSON.stringify(cart))
            );
            return res.json(newCart);
        } else if (cartStored && product) {
            const cart = new Cart(customerId, cartStored.products);
            cart.addOneProduct(productId, cart.products);
            const newCart = await cartDao.updateById(
                cartStored.id,
                JSON.parse(JSON.stringify(cart))
            );
            return res.json(newCart);
        } else {
            return res.json({ error: 'No products were added' });
        }
    };

    removeOneProductUnitFromCart = async (req, res) => {
        const { originalUrl, method } = req;
        logger.info(`Processing request: ${method}-${originalUrl}`);
        const customerId = req.user.id;
        const productId = req.body.productId;

        //1 - get cart 2 - get product 3 - remove product from cart
        let query = {};
        query['customerId'] = customerId;
        const cartStored = await cartDao.getByCustomQuery(query);
        const cart = new Cart(customerId, cartStored.products);
        cart.decreaseOneProduct(productId, cart.products);
        const newCart = await cartDao.updateById(
            cartStored.id,
            JSON.parse(JSON.stringify(cart))
        );
        return res.json(newCart);
    };

    removeProductsFromCart = async (req, res) => {
        const { originalUrl, method } = req;
        logger.info(`Processing request: ${method}-${originalUrl}`);
        const customerId = req.user.id;
        const productId = req.params.id_product;

        //1 - get cart 2 - get product 3 - remove product from cart
        let query = {};
        query['customerId'] = customerId;
        const cartStored = await cartDao.getByCustomQuery(query);
        const cart = new Cart(customerId, cartStored.products);
        logger.info(productId);
        cart.removeProduct(productId);
        const newCart = await cartDao.updateById(
            cartStored.id,
            JSON.parse(JSON.stringify(cart))
        );
        return res.json(newCart);
    };

    getCart = async (req, res) => {
        const { originalUrl, method } = req;
        logger.info(`Processing request: ${method}-${originalUrl}`);
        const customerId = req.user.id;

        let query = {};
        query['customerId'] = customerId;
        const cartStored = await cartDao.getByCustomQuery(query);
        if (cartStored) {
            return res.json(cartStored);
        } else {
            return res.json({});
        }
    };

    createNewOrderFromCart = async (req, res) => {
        const { originalUrl, method } = req;
        logger.info(`Processing request: ${method}-${originalUrl}`);
        const customerId = req.user.id;
        const username = req.user.username;
        let query = {};
        query['customerId'] = customerId;
        const cartStored = await cartDao.getByCustomQuery(query);
        const orderService = new OrderService();
        const order = await orderService.createNewOrder(
            cartStored.customerId,
            cartStored.products,
            username
        );

        res.json({ success: 'New order created for user', order });
        try {
            await cartDao.deleteById(cartStored.id);
        } catch (err) {
            logger.error(err);
        }
    };
}

export default CartController;
