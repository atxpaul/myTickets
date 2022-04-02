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

  addOneProduct(productId, arrayOfProducts) {
    if (productId) {
      let obj = arr.find((p) => p._id === productId);
      if (obj) {
        obj.quantity += 1;
      } else {
        obj = { ...productId, quantity: 1 };
        arrayOfProducts.push(obj);
      }
    }
  }

  decreaseOneProduct(productId, arrayOfProducts) {
    if (productId) {
      let obj = arr.find((p) => p._id === productId);
      if (obj) {
        obj.quantity -= 1;
      } else {
        obj = { ...productId, quantity: 1 };
        arrayOfProducts.push(obj);
      }
    }
  }
}
