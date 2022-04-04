import supertest from 'supertest';
import { expect } from 'chai';
import { app } from '../src/loader/app.js';
import config from '../src/config/config.js';
import mongoose from 'mongoose';
import User from '../src/model/User.js';

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

let jwt;

describe('Ciclo Test Users', () => {
    before(async function () {
        server = await startServer();
        request = supertest(
            `http://localhost:${server.address().port}/api/users`
        );
    });

    after(function () {
        console.log('Deleting data');
        deleteUserFromDb();
        server.close();
    });

    describe('USER SIGNUP', () => {
        it('Signup user and get bearer token', async () => {
            const response = await request
                .post('/signup')
                .field('username', userSignup.username)
                .field('password', userSignup.password)
                .field('name', userSignup.name)
                .field('surname', userSignup.surname)
                .field('address', userSignup.address)
                .field('age', userSignup.age)
                .field('phone', userSignup.phone)
                .attach('avatar', 'test/images/shrug.jpg');

            expect(response.status).to.eql(200);

            const user = response.body;
            jwt = `Bearer ${user.jwt}`;
            expect(user).to.include.keys('username', 'jwt');
            expect(user.username).to.eql(userSignup.username);
            expect(user.jwt).to.have.lengthOf.above(10);
        });
    });

    describe('USER LOGIN', () => {
        it('Login user and get bearer token', async () => {
            console.log(jwt);
            const response = await request.post('/login').send(userLogin);
            expect(response.status).to.eql(200);

            const user = response.body;
            jwt = `Bearer ${user.jwt}`;
            expect(user).to.include.keys('username', 'jwt');
            expect(user.username).to.eql(userLogin.username);
            expect(user.jwt).to.have.lengthOf.above(10);
        });
    });

    describe('USER ACCESS', () => {
        it('User trying to access to protected route with jwt', async () => {
            const response = await request
                .get('/home')
                .send(userLogin)
                .set('Authorization', jwt);
            expect(response.status).to.eql(200);

            const home = response.body;
            expect(home).to.include.keys('user');
            expect(home.user.username).to.eql(userLogin.username);
        });
        it('User trying to access to protected route without jwt', async () => {
            const response = await request.get('/home').send(userLogin);
            expect(response.status).to.eql(401);
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

async function deleteUserFromDb() {
    try {
        mongoose.connect(config.mongodb.url, config.mongodb.options);
    } catch (err) {
        logger.error(err);
    }

    await User.deleteOne({ username: userSignup.username });
}
