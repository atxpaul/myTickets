class MemoryContainer {
  constructor() {
    this.products = [];
  }

  async save(object) {
    let id;
    if (this.products.length > 0) {
      let ids = this.products.map((c) => c.id);
      id = Math.max(...ids) + 1;
    } else {
      id = 1;
    }
    object.id = id;
    this.products.push(object);
    return id;
  }

  async updateById(id, newObject) {
    let object;
    try {
      object = this.products.find((c) => c.id == id);
    } catch (err) {
      console.log(err);
    }
    if (!object) {
      return [];
    }
    this.products = this.products.filter((c) => c.id !== id);

    object.title = newObject.title;
    object.price = newObject.price;
    object.thumbnail = newObject.thumbnail;

    this.products.push(object);

    return object ? object : [];
  }

  async getById(id) {
    let object;
    try {
      object = this.products.find((c) => c.id == id);
    } catch (err) {
      console.log(err);
    }

    return object ? object : [];
  }

  async getAll() {
    return this.products;
  }

  async deleteById(id) {
    this.products = this.products.filter((c) => c.id !== id);
  }

  async deleteAll() {
    this.products = [];
  }
}

export default MemoryContainer;
