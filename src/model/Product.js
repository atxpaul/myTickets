class Product {
  #id;
  #title;
  #price;
  #thumbnail;
  #timestamp;
  constructor(id, title, price, thumbnail, timestamp) {
    this.id = this.setId(id);
    this.title = this.setTitle(title);
    this.price = this.setPrice(price);
    this.thumbnail = this.setThumbnail(thumbnail);
    this.timestamp = this.setTimestamp(timestamp);
  }

  setId(id) {
    if (id) {
      this.id = id;
      return id;
    } else {
      throw Error(`Missing field id for create product`);
    }
  }

  setTitle(title) {
    if (title) {
      this.title = title;
      return title;
    } else {
      throw Error(`Missing field title for create product`);
    }
  }
  setPrice(price) {
    if (price) {
      this.price = price;
      return price;
    } else {
      throw Error(`Missing field price for create product`);
    }
  }
  setThumbnail(thumbnail) {
    if (thumbnail) {
      this.thumbnail = thumbnail;
      return thumbnail;
    } else {
      throw Error(`Missing field thumbnail for create product`);
    }
  }
  setTimestamp(timestamp) {
    if (timestamp) {
      this.timestamp = timestamp;
      return timestamp;
    } else {
      throw Error(`Missing field timestamp for create product`);
    }
  }
}

export default Product;
