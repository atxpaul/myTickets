const salute = document.getElementById('loginp');
const login = document.getElementById('logina');
const productsDiv = document.getElementById('products');

async function getUserLogin() {
  const userRaw = await fetch('/api/users/home', {
    method: 'GET',
  });

  const data = await userRaw.json();

  if (data.user) {
    salute.innerText = `Welcome, ${data.user.name}`;
    login.innerText = `Logout`;
    login.setAttribute('href', '/api/users/logout');
  }
}

async function getProducts() {
  const productsRaw = await fetch('/api/products', {
    method: 'GET',
  });
  const products = await productsRaw.json();
  console.log(products);
  let productsArray = [];
  for (let i in products) {
    console.log(products[i]);
    console.log(i);
    let productHtml = `<div class="col-lg-3 col-sm-6 col-12 mb-4 d-flex align-items-stretch">
        <div class="card">
          <img class="card-img-top" src="${products[i].thumbnail}" alt="">
          <div class="card-body">
            <h3 class="card-title">${products[i].title}</h3>
            <p class="card-text">${products[i].price}</p>
            <a href="" class="btn btn-sm btn-primary mt-auto">Comprar</a>
            <a href="" class="btn btn-sm btn-secondary mt-auto">Detalles</a>
          </div>
        </div>
      </div>`;

    productsArray.push(productHtml);
  }
  productsDiv.innerHTML = productsArray.join(`\n`);
  console.log(productsArray);
  //console.log(productsHtml);
  //productsDiv.innerHTML = productsHtml;
}

(async () => {
  getUserLogin();
  getProducts();
})();
