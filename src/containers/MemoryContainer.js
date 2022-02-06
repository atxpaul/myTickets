class MemoryContainer {
  constructor() {
    this.content = [];
  }

  async save(object) {
    let id;
    if (this.content.length > 0) {
      let ids = this.content.map((c) => c.id);
      id = Math.max(...ids) + 1;
    } else {
      id = 1;
    }
    object.id = id;
    this.content.push(object);
    return id;
  }

  async updateById(id, newObject) {
    let object;
    let numberId = Number(id);
    try {
      object = this.content.find((c) => c.id == numberId);
    } catch (err) {
      logger.error(err);
    }
    if (!object) {
      return [];
    }

    this.content = this.content.filter((c) => c.id !== numberId);

    newObject.id = object.id;

    this.content.push(newObject);

    object = await this.getById(newObject.id);

    return object ? object : [];
  }

  async getById(id) {
    let object;
    try {
      object = this.content.find((c) => c.id == id);
    } catch (err) {
      logger.error(err);
    }

    return object ? object : [];
  }

  async getAll() {
    return this.content;
  }

  async deleteById(id) {
    this.content = this.content.filter((c) => c.id !== id);
  }

  async deleteAll() {
    this.content = [];
  }
}

export default MemoryContainer;
