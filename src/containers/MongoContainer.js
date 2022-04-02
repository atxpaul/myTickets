import mongoose from 'mongoose';
import config from '../config/config.js';
import logger from '../config/logger.js';

await mongoose.connect(config.mongodb.url, config.mongodb.options);

class MongoContainer {
  constructor(collectionName, schemaName) {
    this.collection = mongoose.model(collectionName, schemaName);
  }

  async save(object) {
    let insert;
    try {
      insert = await this.collection.create(object);
    } catch (err) {
      logger.error(err);
    }
    return insert;
  }

  async updateById(id, newObject) {
    let data;
    try {
      await this.collection.findOneAndUpdate({ _id: id }, newObject);
      data = this.getById(id);
    } catch (err) {
      logger.error(err);
    }
    return data;
  }

  async getById(id) {
    let object;
    try {
      object = await this.collection.findOne({ _id: id });
    } catch (err) {
      logger.error(err);
    }
    return object;
  }

  async getAll() {
    let objects = [];
    try {
      objects = await this.collection.find({});
    } catch (err) {
      logger.error(err);
    }
    return objects;
  }

  async deleteById(id) {
    await this.collection.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    await this.collection.remove({});
  }

  //This method is used to provide custom queries setted on the arguments
  async getByCustomQuery(query) {
    let object;
    logger.info(`The query is: ${query}`);
    try {
      object = await this.collection.findOne(query);
    } catch (err) {
      logger.error(err);
    }
    logger.info(object);
    return object;
  }
}

export default MongoContainer;
