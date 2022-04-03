import supertest from 'supertest';
import { expect } from 'chai';
import { app } from '../src/loader/app.js';
import config from '../src/config/config.js';
import mongoose from 'mongoose';
import User from '../src/model/User.js';

import { productDao } from '../src/dao/ProductDaoFactory.js';
import { orderDao } from '../src/dao/OrderDaoFactory.js';

let request;
let server;

const userSignup = {
    username: 'test@test',
    password: '1234',
    name: 'Test',
    surname: 'Test',
    address: 'Street',
    age: 99,
    phone: '666666666',
};

const userLogin = {
    username: 'test@test',
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
        connectBd();
        server = await startServer();
        request = supertest(
            `http://localhost:${server.address().port}/api/carts`
        );
        idProduct1 = (await addProduct(product1))._id.toString();
        idProduct2 = (await addProduct(product2))._id.toString();
    });

    after(function () {
        server.close();
    });

    describe('CART', () => {
        it('Add 1 product to cart', async () => {
            const jwt = await createUser(userSignup);
            console.log(jwt);
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

            const response = await request
                .post('/order')
                .set('Authorization', jwt)
                .send({});

            expect(response.status).to.eql(200);

            const cart = response.body;

            orderId = cart.order._id.toString();

            expect(cart.order).to.include.keys(
                'customerId',
                'products',
                'status'
            );
            expect(cart.order.products).to.have.lengthOf(1);
            expect(cart.order.products[0]).to.include({
                productId: idProduct1,
                quantity: 2,
            });
        });
    });
});

describe('Orders tests cicle', () => {
    before(async function () {
        server = await startServer();
        request = supertest(
            `http://localhost:${server.address().port}/api/orders`
        );
    });
    after(async function () {
        console.log('Deleting data');
        deleteProduct(idProduct1);
        deleteProduct(idProduct2);
        deleteOrder(orderId);
        deleteUserFromDb();
    });
    describe('Order', () => {
        it('Find Orders', async () => {
            const jwt = await getToken(userLogin);
            console.log(jwt);

            const response = await request.get('/').set('Authorization', jwt);

            expect(response.status).to.eql(200);

            const order = response.body;

            expect(order[0]).to.include.keys(
                'customerId',
                'products',
                'status'
            );
            expect(order[0].products).to.have.lengthOf(1);
            expect(order[0].products[0]).to.include({
                productId: idProduct1,
                quantity: 2,
            });
        });
        it('Find Orders by ID', async () => {
            const jwt = await getToken(userLogin);
            console.log(jwt);

            const response = await request
                .get('/' + orderId)
                .set('Authorization', jwt);

            expect(response.status).to.eql(200);

            const order = response.body;

            expect(order).to.include.keys('customerId', 'products', 'status');
            expect(order.products).to.have.lengthOf(1);
            expect(order.products[0]).to.include({
                productId: idProduct1,
                quantity: 2,
            });
        });
    });
});

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0;
        const server = app.listen(PORT, () => {
            console.log(
                `Servidor express escuchando en el puerto ${
                    server.address().port
                }`
            );
            resolve(server);
        });
        server.on('error', (error) => {
            console.log(`Error en Servidor: ${error}`);
            reject(error);
        });
    });
}

async function createUser(user) {
    console.log('Creating user');
    const requestUser = supertest(
        `http://localhost:${server.address().port}/api/users`
    );
    const newUser = await requestUser
        .post('/signup')
        .field('username', user.username)
        .field('password', user.password)
        .field('name', user.name)
        .field('surname', user.surname)
        .field('address', user.address)
        .field('age', user.age)
        .field('phone', user.phone)
        .attach('avatar', 'test/images/shrug.jpg');

    const signup = newUser.body;
    const jwt = `Bearer ${signup.jwt}`;
    console.log(jwt);
    return jwt;
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

async function connectBd() {
    try {
        mongoose.connect(config.mongodb.url, config.mongodb.options);
    } catch (err) {
        console.log(err);
    }
}

async function addProduct(product) {
    return await productDao.save(product);
}

async function deleteProduct(id) {
    await productDao.deleteById(id);
}

async function deleteOrder(id) {
    console.log(`Deleting order ${id}`);

    await orderDao.deleteAll();
}

async function deleteUserFromDb() {
    console.log('Deleting user');

    await User.deleteMany({ username: userSignup.username });
}
