import admin from 'firebase-admin';
import fs from 'fs';
import config from '../config/config.js';

const serviceAccount = JSON.parse(
  fs.readFileSync(config.firebase.uri, 'utf-8')
);

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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
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
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await this.collection.doc().delete();
    } catch (err) {
      console.log(err);
    }
  }
}

export default FirestoreContainer;
