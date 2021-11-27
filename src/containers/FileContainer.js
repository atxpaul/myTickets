import fs from 'fs';

class FileContainer {
  constructor(fileName) {
    this.fileName = fileName;
    const names = fs.readdirSync(process.cwd());
    if (names.indexOf(fileName) == -1) {
      fs.writeFileSync(fileName, '');
    }
  }

  async save(object) {
    let id;
    let content = await this.getAll();
    if (content.length > 0) {
      let ids = content.map((c) => c.id);
      id = Math.max(...ids) + 1;
    } else {
      id = 1;
      content = [];
    }
    object.id = id;
    content.push(object);
    const json = JSON.stringify(content, null, 4);
    try {
      await fs.promises.writeFile(this.fileName, json, 'utf-8');
    } catch (err) {
      console.log(err);
    }
    return id;
  }

  async updateById(id, newObject) {
    let object;
    let content = await this.getAll();
    let numberId = Number(id);
    try {
      object = content.find((c) => c.id == numberId);
    } catch (err) {
      console.log(err);
    }
    if (!object) {
      return [];
    }
    content = content.filter((c) => c.id !== numberId);

    newObject.id = object.id;

    content.push(newObject);

    const json = JSON.stringify(content, null, 4);
    try {
      await fs.promises.writeFile(this.fileName, json, 'utf-8');
    } catch (err) {
      console.log(err);
    }

    object = await this.getById(newObject.id);

    return object ? object : [];
  }

  async getById(id) {
    let object;
    let content = await this.getAll();
    try {
      object = content.find((c) => c.id == id);
    } catch (err) {
      console.log(err);
    }

    return object ? object : [];
  }

  async getAll() {
    let content;
    try {
      content = await fs.promises.readFile(this.fileName, 'utf-8');
    } catch (err) {}
    if (content) {
      return JSON.parse(content);
    } else {
      return [];
    }
  }

  async deleteById(id) {
    let content = await this.getAll();
    content = content.filter((c) => c.id !== id);
    const json = JSON.stringify(content, null, 4);
    try {
      await fs.promises.writeFile(this.fileName, json, 'utf-8');
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.fileName, '', 'utf-8');
    } catch (err) {
      console.log(err);
    }
  }
}

export default FileContainer;
