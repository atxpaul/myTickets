class Order {
  #customerId;
  #timestamp;
  #products = [];
  #status;

  constructor(customerId, products = [], status = 'pending') {
    this.setCustomerId(customerId);
    this.setProducts(products);
    this.setStatus(status);
    this.setTimestamp(new Date());
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

  setStatus(status) {
    if (status) {
      this.status = status;
    } else {
      throw Error('Missing status');
    }
  }

  setTimestamp(timestamp) {
    if (timestamp) {
      this.timestamp = timestamp;
    } else {
      throw Error('Missing timestamp');
    }
  }
}

export default Order;
