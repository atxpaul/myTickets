import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/loader/app.js';

let request;
let server;

const productInsert = {
  title: 'Bolígrafo',
  price: 3.5,
  thumbnail: 'https://cdn3.iconfinder.com/data/icons/vol-4/128/pen-256.png',
};

const productUpdate = {
  title: 'Lápiz',
  price: 1.5,
  thumbnail:
    'https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-512.png',
};

let id;

describe('Ciclo Test CRUD Productos', () => {
  before(async function () {
    server = await startServer();
    request = supertest(
      `http://localhost:${server.address().port}/api/products`
    );
  });

  after(function () {
    server.close();
  });

  describe('POST - PRODUCT', () => {
    it('Add 1 product', async () => {
      const response = await request.post('/').send(productInsert);
      expect(response.status).to.eql(200);

      const product = response.body;
      id = product.id;
      expect(product).to.include.keys('id', 'title', 'price', 'thumbnail');
      expect(product.title).to.eql(productInsert.title);
      expect(product.price).to.eql(productInsert.price);
      expect(product.thumbnail).to.eql(productInsert.thumbnail);
    });
  });

  describe('GET - PRODUCT', () => {
    it('Read all products', async () => {
      const response = await request.get('/');
      expect(response.status).to.eql(200);
      const products = response.body;
      expect(products).not.to.be.empty;
    });
    it('Read product by ID', async () => {
      const response = await request.get(`/${id}`);
      expect(response.status).to.eql(200);
      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productInsert.title);
      expect(product.price).to.eql(productInsert.price);
      expect(product.thumbnail).to.eql(productInsert.thumbnail);
    });
  });

  describe('PUT - PRODUCT', () => {
    it('Update a product', async () => {
      const response = await request.put(`/${id}`).send(productUpdate);
      expect(response.status).to.eql(200);

      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productUpdate.title);
      expect(product.price).to.eql(productUpdate.price);
      expect(product.thumbnail).to.eql(productUpdate.thumbnail);
    });
  });

  describe('DELETE - PRODUCT', () => {
    it('Delete a product', async () => {
      const response = await request.delete(`/${id}`);
      expect(response.status).to.eql(200);

      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productUpdate.title);
      expect(product.price).to.eql(productUpdate.price);
      expect(product.thumbnail).to.eql(productUpdate.thumbnail);
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
