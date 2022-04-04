import config from '../config/config.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';

class Mongo {
    constructor() {}
    connectDb = async () => {
        try {
            mongoose.connect(config.mongodb.url, config.mongodb.options);
            logger.info(`Database is connected`);
        } catch (err) {
            logger.error(err);
        }
    };
}

export default Mongo;
