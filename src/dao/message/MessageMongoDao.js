import MongoContainer from '../../containers/MongoContainer.js';

class MessageMongoDao extends MongoContainer {
  constructor() {
    super('messages', {
      username: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Number, required: true },
    });
  }
}

export default MessageMongoDao;
