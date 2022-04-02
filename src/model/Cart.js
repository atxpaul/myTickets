class Cart {
  #customerUsername;
  #products = [];

  constructor(customerUsername) {
    this.#customerUsername = customerUsername;
  }

  setCustomerUsername(customerUsername) {
    if (customerUsername) {
      this.customerUsername = customerUsername;
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
}
