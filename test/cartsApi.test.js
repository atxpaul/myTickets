import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/loader/app.js';

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
};

const product2 = {
  title: 'Lápiz',
  price: 4.5,
  thumbnail: 'pencil.jpg',
};

let jwt;

describe('Carts test cycle', () => {
  before(async function () {
    server = await startServer();
    request = supertest(`http://localhost:${server.address().port}/api/carts`);
  });

  after(function () {
    server.close();
  });

  describe('POST - CART', () => {
    it('Add 1 product to cart', async () => {
      await getToken();
      //ADD PRODUCT TO DB
      const id1 = await addProduct(product1);
      //ADD PRODUCT TO CART

      //   const response = await request
      //     .post('/')
      //     .set('Authorization', jwt)
      //     .field('productId', id1);

      //   expect(response.status).to.eql(200);

      //   const cart = response.body;
      //   expect(cart).to.include.keys('customerId', 'products');
      //   expect(cart.products[0].productId).to.eql(id);
      //   expect(cart.products[0].productId).to.eql(1);
      deleteProduct(id1);
    });
  });
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

async function getToken() {
  const requestUser = supertest(
    `http://localhost:${server.address().port}/api/users`
  );

  const userlogin = await requestUser.post('/login').send(userLogin);

  const user = userlogin.body;
  console.log(user);
  jwt = `Bearer ${user.jwt}`;
}

async function addProduct(product) {
  console.log('Insertando producto');
  const requestProduct = supertest(
    `http://localhost:${server.address().port}/api/products`
  );
  const response = await requestProduct
    .post('/')
    .set('Authorization', jwt)
    .field('title', product.title)
    .field('price', product.price)
    .attach('thumbnail', 'test/images/pen.jpg');
  const productInserted = response.body;
  const id = productInserted._id;
  console.log(id);
  return id;
}

async function deleteProduct(id) {
  const requestProduct = supertest(
    `http://localhost:${server.address().port}/api/products`
  );
  await requestProduct.delete(`/${id}`).set('Authorization', jwt);
}
