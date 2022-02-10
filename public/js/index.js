const salute = document.getElementById('loginp');
const login = document.getElementById('logina');
const productsDiv = document.getElementById('products');
let cartId = undefined;
let username;

async function getUserLogin() {
  const userRaw = await fetch('/api/users/home', {
    method: 'GET',
  });

  const data = await userRaw.json();

  if (data.user) {
    salute.innerText = `Welcome, ${data.user.name}`;
    login.innerText = `Logout`;
    login.setAttribute('href', '/api/users/logout');
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
  // const cartRaw = await fetch(`/api/cart/${cartId}/products`, {
  //   method: 'POST',
  //   body: { productId: productId },
  // });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/api/cart/${cartId}/products`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(
    JSON.stringify({
      productId: productId,
    })
  );
  console.log(cartRaw);
}

async function createNewCart() {
  const cartRaw = await fetch('/api/cart/', {
    method: 'POST',
  });
  cartId = await cartRaw.json();

  if (isEmpty(cartId)) cartId = 0;
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
  }
  productsDiv.innerHTML = productsArray.join(`\n`);
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
})();

function redireccionar(pagina) {
  location.href = pagina;
}

function goLogin() {
  redireccionar('/api/users/login');
}
