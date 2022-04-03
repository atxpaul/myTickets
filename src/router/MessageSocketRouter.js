import logger from '../config/logger.js';
import MessageController from '../controller/MessageController.js';

class MessageSocketRouter {
    constructor(io) {
        this.io = io;
        this.messageController = new MessageController();
    }

    startRouter = async () => {
        logger.info(`Starting MessageSocketRouter`);
        this.io.on('connection', async (socket) => {
            logger.info('A new client is connected!');
            let data = await this.messageController.getAllMessages();
            if (data.length > 0) {
                socket.emit('messages', data);
            }
            socket.on('new-message', async (data) => {
                logger.info(`Message received ${data}`);
                await this.messageController.createMessage(data);
                let dataStored = await this.messageController.getAllMessages();

                this.io.sockets.emit('messages', dataStored);
            });
        });
    };
}

export default MessageSocketRouter;
