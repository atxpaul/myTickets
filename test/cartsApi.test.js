import supertest from 'supertest';
import { expect } from 'chai';
import { app } from '../src/loader/app.js';
import config from '../src/config/config.js';
import mongoose from 'mongoose';
import { productDao } from '../src/dao/ProductDaoFactory.js';
import { orderDao } from '../src/dao/OrderDaoFactory.js';

let request;
let server;

const userLogin = {
  username: 'pablo@pablo',
  password: '1234',
};

const product1 = {
  title: 'Bolígrafo',
  price: 3.5,
  thumbnail: 'pen.jpg',
  timestamp: Date.now(),
};

const product2 = {
  title: 'Lápiz',
  price: 4.5,
  thumbnail: 'pencil.jpg',
  timestamp: Date.now(),
};

let idProduct1, idProduct2;
let orderId;

describe('Carts test cycle', () => {
  before(async function () {
    server = await startServer();
    request = supertest(`http://localhost:${server.address().port}/api/carts`);
    idProduct1 = (await addProduct(product1))._id.toString();
    idProduct2 = (await addProduct(product2))._id.toString();
  });

  after(function () {
    deleteProduct(idProduct1);
    deleteProduct(idProduct2);
    deleteOrder(orderId);
    server.close();
  });

  describe('CART', () => {
    it('Add 1 product to cart', async () => {
      const jwt = await getToken(userLogin);
      //ADD PRODUCT TO CART

      const response = await request
        .put('/add')
        .set('Authorization', jwt)
        .send({ productId: idProduct1 });

      expect(response.status).to.eql(200);

      const cart = response.body;

      expect(cart).to.include.keys('customerId', 'products');
      expect(cart.products[0].productId).to.eql(idProduct1);
      expect(cart.products[0].quantity).to.eql(1);
    });

    it('Decrease 1 product from cart', async () => {
      const jwt = await getToken(userLogin);
      //ADD PRODUCT TO CART

      const response = await request
        .put('/decrease')
        .set('Authorization', jwt)
        .send({ productId: idProduct1 });

      expect(response.status).to.eql(200);

      const cart = response.body;

      expect(cart).to.include.keys('customerId', 'products');
      expect(cart.products).to.be.empty;
    });

    it('Add 2 products to cart and get both', async () => {
      const jwt = await getToken(userLogin);
      //ADD PRODUCT TO CART

      await request
        .put('/add')
        .set('Authorization', jwt)
        .send({ productId: idProduct1 });
      await request
        .put('/add')
        .set('Authorization', jwt)
        .send({ productId: idProduct1 });
      await request
        .put('/add')
        .set('Authorization', jwt)
        .send({ productId: idProduct2 });
      await request
        .put('/add')
        .set('Authorization', jwt)
        .send({ productId: idProduct2 });

      const response = await request.get('/').set('Authorization', jwt);

      expect(response.status).to.eql(200);

      const cart = response.body;

      expect(cart).to.include.keys('customerId', 'products');
      expect(cart.products).to.have.lengthOf(2);
      expect(cart.products[0]).to.include({
        productId: idProduct1,
        quantity: 2,
      });
      expect(cart.products[1]).to.include({
        productId: idProduct2,
        quantity: 2,
      });
    });

    it('Remove product from cart', async () => {
      const jwt = await getToken(userLogin);
      //ADD PRODUCT TO CART

      const response = await request
        .delete('/products/' + idProduct2)
        .set('Authorization', jwt)
        .send({ productId: idProduct1 });

      expect(response.status).to.eql(200);

      const cart = response.body;

      expect(cart).to.include.keys('customerId', 'products');
      expect(cart.products).to.have.lengthOf(1);
      expect(cart.products[0]).to.include({
        productId: idProduct1,
        quantity: 2,
      });
    });

    it('Sell Cart and receive order', async () => {
      const jwt = await getToken(userLogin);
      //ADD PRODUCT TO CART

      const response = await request
        .post('/order')
        .set('Authorization', jwt)
        .send({});

      expect(response.status).to.eql(200);

      const cart = response.body;

      orderId = cart.order._id.toString();

      expect(cart.order).to.include.keys('customerId', 'products', 'status');
      expect(cart.order.products).to.have.lengthOf(1);
      expect(cart.order.products[0]).to.include({
        productId: idProduct1,
        quantity: 2,
      });
    });
  });

  describe('GET - CART', () => {});
});

async function startServer() {
  return new Promise((resolve, reject) => {
    const PORT = 0;
    const server = app.listen(PORT, () => {
      console.log(
        `Servidor express escuchando en el puerto ${server.address().port}`
      );
      resolve(server);
    });
    server.on('error', (error) => {
      console.log(`Error en Servidor: ${error}`);
      reject(error);
    });
  });
}

async function getToken(user) {
  const requestUser = supertest(
    `http://localhost:${server.address().port}/api/users`
  );

  const userlogin = await requestUser.post('/login').send(user);

  const login = userlogin.body;
  console.log(login);
  const jwt = `Bearer ${login.jwt}`;
  return jwt;
}

async function addProduct(product) {
  try {
    mongoose.connect(config.mongodb.url, config.mongodb.options);
  } catch (err) {
    console.log(err);
  }

  return await productDao.save(product);
}

async function deleteProduct(id) {
  try {
    mongoose.connect(config.mongodb.url, config.mongodb.options);
  } catch (err) {
    console.log(err);
  }

  await productDao.deleteById(id);
}

async function deleteOrder(id) {
  try {
    mongoose.connect(config.mongodb.url, config.mongodb.options);
  } catch (err) {
    console.log(err);
  }
  console.log(`Deleting order ${id}`);

  await orderDao.deleteAll();
}
