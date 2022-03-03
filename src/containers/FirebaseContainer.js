import admin from 'firebase-admin';
import config from '../config/config.js';
import logger from '../config/logger.js';

const serviceAccount = config.firebase.options;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

class FirestoreContainer {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async save(object) {
    let insert;
    try {
      insert = await this.collection.add(object);
    } catch (err) {
      logger.error(err);
    }
    return insert.id;
  }

  async updateById(id, newObject) {
    let update;
    let data;
    try {
      update = await this.collection.doc(id).update(newObject);
      data = this.getById(id);
    } catch (err) {
      logger.error(err);
    }
    return data;
  }

  async getById(id) {
    let select;
    let data;
    try {
      select = await this.collection.doc(id).get();
      data = select.data();
    } catch (err) {
      logger.error(err);
    }
    if (data) {
      return { id, ...data };
    } else {
      return null;
    }
  }

  async getAll() {
    const asObj = (doc) => ({ id: doc.id, ...doc.data() });
    let select = [];
    const snapshot = await this.collection.get();
    snapshot.forEach((doc) => {
      select.push(asObj(doc));
    });
    return select;
  }

  async deleteById(id) {
    try {
      await this.collection.doc(id).delete();
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteAll() {
    try {
      await this.collection.doc().delete();
    } catch (err) {
      logger.error(err);
    }
  }
}

export default FirestoreContainer;
