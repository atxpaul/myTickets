const salute = document.getElementById('user');
const login = document.getElementById('logina');
const productsDiv = document.getElementById('products');
const displayCheckout = document.getElementById('displayCheckout');
const dropDown = document.getElementById('navbarUserDropdown');
const checkout = document.getElementById('checkout');
const cartDiv = document.getElementById('cart');
let productList = [];
let cartId = undefined;
let username;
let name;

async function getUserLogin() {
  const userRaw = await fetch('/api/users/home', {
    method: 'GET',
  });

  const data = await userRaw.json();

  if (data.user) {
    salute.innerText = `Welcome, ${data.user.name}`;
    login.innerText = `Logout`;
    login.setAttribute('href', '/api/users/logout');
    displayCheckout.classList.remove('hidden');
    checkout.classList.remove('hidden');
    displayCheckout.classList.add('dropdown-menu');
    dropDown.classList.add('dropdown-toggle');
    name = data.user.name;
    return data.user.username;
  } else {
    salute.innerText = `Welcome, visitor`;
    login.innerText = `Login`;
    login.setAttribute('href', '/api/users/login');
    return undefined;
  }
}

async function addProductsToCart(productId) {
  if (!username) {
    goLogin();
  }
  let data = { productId: productId };

  console.log(`Trying to add product ${productId} to cart ${cartId}`);
  console.log(`Product in JSON ${data}`);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/api/cart/${cartId}/products`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(
    JSON.stringify({
      productId: productId,
    })
  );
  await updateCartView();
}

async function updateCartView() {
  const cartRaw = await fetch(`/api/cart/${cartId}/products`, {
    method: 'GET',
  });
  const cart = await cartRaw.json();
  let cartProductsHtmlArray = [];
  console.log(cart);
  if (cart.length > 0) {
    salute.innerText = `Welcome, ${name} 🛒`;

    for (product of cart) {
      console.log(product);
      let obj = productList.find((o) => o.productId === product.id);
      console.log(obj);
      let cartProductHtml = `
      <a href="#" class="dropdown-item">${obj.title}</a>
      `;
      cartProductsHtmlArray.push(cartProductHtml);
    }
    console.log(`Displaying cart ${cartProductsHtmlArray}`);
    cartDiv.innerHTML = cartProductsHtmlArray.join(`\n`);
  }
}

async function createNewCart() {
  const cartRaw = await fetch('/api/cart/', {
    method: 'POST',
  });
  cartId = await cartRaw.json();
}

async function getCartsByUser() {
  const cart = await fetch(`/api/cart/`, {
    method: 'GET',
  });
  try {
    cartId = await cart.json();
  } catch (err) {}
}

async function getProducts() {
  const productsRaw = await fetch('/api/products', {
    method: 'GET',
  });
  const products = await productsRaw.json();
  let productsArray = [];
  for (let i in products) {
    let productForList = {
      productId: products[i].id,
      title: products[i].title,
      price: products[i].price,
    };
    let productHtml = `<div class="col-lg-3 col-sm-6 col-12 mb-4 d-flex align-items-stretch">
        <div class="card">
          <img class="card-img-top" src="${products[i].thumbnail}" alt="">
          <div class="card-body">
            <h3 class="card-title">${products[i].title}</h3>
            <p class="card-text">${products[i].price}</p>
            <button id="${products[i].id}" class="buy-button btn btn-sm btn-primary mt-auto">Comprar</button>
            <a href="/api/test/${products[i].id}" class="btn btn-sm btn-secondary mt-auto">Detalles</a>
          </div>
        </div>
      </div>`;

    productsArray.push(productHtml);
    productList.push(productForList);
  }
  productsDiv.innerHTML = productsArray.join(`\n`);
}

async function checkoutNewOrder() {
  console.log(`Checkout cart ${cartId}`);
  await fetch(`/api/cart/${cartId}/order`, {
    method: 'POST',
  });
}

(async () => {
  username = await getUserLogin();
  if (username) {
    await getCartsByUser();

    if (cartId == null) {
      await createNewCart();
    }
  }
  await getProducts();
  document.querySelectorAll('.buy-button').forEach((item) => {
    item.addEventListener('click', (event) => {
      addProductsToCart(event.target.id);
    });
  });
  document.getElementById('checkout').addEventListener('click', (event) => {});
  if (username) {
    updateCartView();
  }
})();

function redireccionar(pagina) {
  location.href = pagina;
}

function goLogin() {
  redireccionar('/api/users/login');
}
