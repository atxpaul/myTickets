class Cart {
  #customerId;
  #products = [];

  constructor(customerId) {
    this.#customerId = customerId;
  }

  setCustomerId(customerId) {
    if (customerId) {
      this.customerId = customerId;
    } else {
      throw Error('Missing customer username');
    }
  }

  addProduct(product) {
    if (product) {
      this.products.push(product);
    } else {
      throw Error('Missing product');
    }
  }

  removeProduct(product) {
    if (product) {
      this.products.splice(this.products.indexOf(product), 1);
    } else {
      throw Error('Missing product');
    }
  }

  addOneProduct(product, arrayOfProducts) {
    if (product) {
    }
  }
}
