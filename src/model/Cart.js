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

    removeProduct(productId) {
        if (productId) {
            let obj = this.products.find((p) => p.productId === productId);
            if (this.products.indexOf(obj) > -1) {
                this.products.splice(this.products.indexOf(obj), 1);
            }
        } else {
            throw Error('Missing product');
        }
    }

    addOneProduct(productId, arrayOfProducts) {
        if (productId) {
            let obj = arrayOfProducts.find((p) => p.productId === productId);
            if (obj) {
                obj.quantity += 1;
            } else {
                obj = { productId, quantity: 1 };
                arrayOfProducts.push(obj);
            }
        }
    }

    decreaseOneProduct(productId, arrayOfProducts) {
        if (productId) {
            let obj = arrayOfProducts.find((p) => p.productId === productId);
            if (obj) {
                obj.quantity -= 1;
                if (obj.quantity === 0) {
                    this.removeProduct(obj.productId);
                }
            }
        }
    }
}

export default Cart;
