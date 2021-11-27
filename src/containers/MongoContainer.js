import mongoose from 'mongoose';
import config from '../config/config.js';

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
      console.log(err);
    }
    return insert;
  }

  async updateById(id, newObject) {
    let update;
    try {
      update = await this.collection.findByIdAndUpdate({ _id: id }, newObject);
    } catch (err) {
      console.log(err);
    }
    return update;
  }

  async getById(id) {
    let object;
    try {
      object = await this.collection.findOne({ _id: id });
    } catch (err) {}
    return object;
  }

  async getAll() {
    let objects = [];
    try {
      objects = await this.collection.find({});
    } catch (err) {}
    return objects;
  }

  async deleteById(id) {
    await this.collection.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    await this.collection.remove({});
  }
}

export default MongoContainer;
