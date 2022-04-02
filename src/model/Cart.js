class Cart {
  #customerId;
  #products = [];

  constructor(customerId, products = []) {
    this.setCustomerId(customerId);
    this.setProducts(products);
  }

  setCustomerId(customerId) {
    if (customerId) {
      this.customerId = customerId;
    } else {
      throw Error('Missing customer username');
    }
  }

  setProducts(products) {
    if (products) {
      this.products = products;
    } else {
      throw Error('Missing products');
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
      let obj = arrayOfProducts.find((p) => p.productId === productId);
      console.log('Hola');
      console.log(arrayOfProducts);
      if (obj) {
        obj.quantity += 1;
        console.log(`Obj +1: ${obj}`);
      } else {
        obj = { productId, quantity: 1 };
        arrayOfProducts.push(obj);
      }
    }
  }

  decreaseOneProduct(productId, arrayOfProducts) {
    if (productId) {
      let obj = arrayOfProducts.find((p) => p._id === productId);
      if (obj) {
        obj.quantity -= 1;
      } else {
        obj = { ...productId, quantity: 1 };
        arrayOfProducts.push(obj);
      }
    }
  }
}

export default Cart;
