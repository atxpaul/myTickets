import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/loader/app.js';

let request;
let server;

const productInsert = {
  title: 'Bolígrafo',
  price: '3.5',
  thumbnail: 'https://cdn3.iconfinder.com/data/icons/vol-4/128/pen-256.png',
};

const productUpdate = {
  title: 'Lápiz',
  price: '1.5',
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

  describe('POST', () => {
    it('Añadir un producto', async () => {
      const response = await request.post('/').send(productInsert);
      expect(response.status).to.eql(200);

      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productInsert.title);
      expect(product.price).to.eql(productInsert.price);
      expect(product.thumbnail).to.eql(productInsert.thumbnail);
      id = product.id;
    });
  });

  describe('GET', () => {
    it('Listar productos', async () => {
      const response = await request.get('/');
      expect(response.status).to.eql(200);
      const products = response.body;
      expect(products).not.to.be.empty;
    });
    it('Listar producto por ID', async () => {
      const response = await request.get(`/${id}`);
      expect(response.status).to.eql(200);
      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productInsert.title);
      expect(product.price).to.eql(productInsert.price);
      expect(product.thumbnail).to.eql(productInsert.thumbnail);
    });
  });

  describe('PUT', () => {
    it('Actualizar un producto', async () => {
      const response = await request.put(`/${id}`).send(productUpdate);
      expect(response.status).to.eql(200);

      const product = response.body;
      expect(product).to.include.keys('title', 'price', 'thumbnail');
      expect(product.title).to.eql(productUpdate.title);
      expect(product.price).to.eql(productUpdate.price);
      expect(product.thumbnail).to.eql(productUpdate.thumbnail);
    });
  });

  describe('DELETE', () => {
    it('Borrar un producto', async () => {
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
