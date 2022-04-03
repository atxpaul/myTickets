import mongoose from 'mongoose';
import { messageDao } from '../src/dao/MessageDaoFactory.js';

import { expect } from 'chai';
import { io as Client } from 'socket.io-client';
import { httpServer } from '../src/loader/app.js';

let server;
let socketUrl;

describe('Sockets test cycle', () => {
    before(async function () {
        server = await startServer();
        socketUrl = `http://localhost:${server.address().port}`;
    });

    after(function () {
        server.close();
    });

    describe('SOCKET', () => {
        it('Should receive a message', async () => {
            const client = new Client(socketUrl);
            const message = {
                text: 'Test',
                username: 'test@test',
            };
            client.on('messages', (arg, done) => {
                console.log('Receiving message');
                expect(arg).to.eql(message);
                client.disconnect();
                done();
            });
            //Only with this await I'm able to connect to server.
            //await new Promise((r) => setTimeout(r, 1000));

            client.on('connect', () => {
                client.emit('new-message', message);
                console.log('Sending message');
            });
        });
    });
});

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0;
        const server = httpServer.listen(PORT, () => {
            console.log(`Server listening on port ${server.address().port}`);
            resolve(server);
        });
        server.on('error', (error) => {
            console.log(`Error on server: ${error}`);
            reject(error);
        });
    });
}
