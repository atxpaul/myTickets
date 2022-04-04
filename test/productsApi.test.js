import supertest from 'supertest';
import { expect } from 'chai';
import { app } from '../src/loader/app.js';
import config from '../src/config/config.js';
import mongoose from 'mongoose';
import User from '../src/model/User.js';

let request;
let server;

config.adminMail = 'admin@admin';

const userLogin = {
    username: 'admin@admin',
    password: '1234',
};

const userSignup = {
    username: 'admin@admin',
    password: '1234',
    name: 'Test',
    surname: 'Test',
    address: 'Street',
    age: 99,
    phone: '666666666',
};

const productInsert = {
    title: 'Bolígrafo',
    price: 3.5,
    thumbnail: 'pen.jpg',
};

const productUpdate = {
    title: 'Lápiz',
    price: 1.5,
    thumbnail: 'pencil.jpg',
};

let id;
let jwt;

describe('Products test cycle', () => {
    before(async function () {
        server = await startServer();
        request = supertest(
            `http://localhost:${server.address().port}/api/products`
        );
        jwt = await createUser(userSignup);
    });

    after(function () {
        server.close();
        deleteUserFromDb();
    });

    describe('POST - PRODUCT', () => {
        it('Add 1 product', async () => {
            await getToken();
            const response = await request
                .post('/')
                .set('Authorization', jwt)
                .field('title', productInsert.title)
                .field('price', productInsert.price)
                .attach('thumbnail', 'test/images/pen.jpg');

            expect(response.status).to.eql(200);

            const product = response.body;
            id = product._id;
            expect(product).to.include.keys(
                '_id',
                'title',
                'price',
                'thumbnail'
            );
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
            const response = await request
                .put(`/${id}`)
                .set('Authorization', jwt)
                .field('title', productUpdate.title)
                .field('price', productUpdate.price)
                .attach('thumbnail', 'test/images/pencil.jpg');
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
            const response = await request
                .delete(`/${id}`)
                .set('Authorization', jwt);
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

async function getToken() {
    const requestUser = supertest(
        `http://localhost:${server.address().port}/api/users`
    );

    const userlogin = await requestUser.post('/login').send(userLogin);

    const user = userlogin.body;
    console.log(user);
    jwt = `Bearer ${user.jwt}`;
}

async function deleteUserFromDb() {
    try {
        mongoose.connect(config.mongodb.url, config.mongodb.options);
    } catch (err) {
        logger.error(err);
    }

    await User.deleteOne({ username: userSignup.username });
}
