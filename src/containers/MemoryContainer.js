class MemoryContainer {
  constructor() {
    this.productos = [];
  }

  async save(objeto) {
    let id;
    if (this.productos.length > 0) {
      let ids = this.productos.map((c) => c.id);
      id = Math.max(...ids) + 1;
    } else {
      id = 1;
    }
    objeto.id = id;
    this.productos.push(objeto);
    return id;
  }

  async updateById(id, nuevoObjeto) {
    let objeto;
    try {
      objeto = this.productos.find((c) => c.id == id);
    } catch (err) {
      console.log(err);
    }
    if (!objeto) {
      return [];
    }
    this.productos = this.productos.filter((c) => c.id !== id);

    objeto.title = nuevoObjeto.title;
    objeto.price = nuevoObjeto.price;
    objeto.thumbnail = nuevoObjeto.thumbnail;

    this.productos.push(objeto);

    return objeto ? objeto : [];
  }

  async getById(id) {
    let objeto;
    try {
      objeto = this.productos.find((c) => c.id == id);
    } catch (err) {
      console.log(err);
    }

    return objeto ? objeto : [];
  }

  async getAll() {
    return this.productos;
  }

  async deleteById(id) {
    this.productos = this.productos.filter((c) => c.id !== id);
  }

  async deleteAll() {
    this.productos = [];
  }
}

export default MemoryContainer;
