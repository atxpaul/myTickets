import logger from '../config/logger.js';
import Message from '../model/Message.js';
import { messageDao } from '../dao/MessageDaoFactory.js';

class MessageController {
    constructor() {}

    createMessage = async (newMessage) => {
        logger.info(`Attempting to create new Message`);
        const { username, text } = newMessage;
        const message = new Message(username, Date.now(), text);
        await messageDao.save(message);
    };

    getAllMessages = async () => {
        logger.info(`Attempting get all messages`);
        const messages = await messageDao.getAll();
        return messages;
    };
}

export default MessageController;
