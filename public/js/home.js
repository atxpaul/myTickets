const userdata = document.getElementById('#userdata');

function redireccionar(pagina) {
  location.href = pagina;
}

function goShopping() {
  redireccionar('/');
}
function goLogout() {
  redireccionar('/api/users/logout');
}

(async () => {
  try {
    const userRaw = await fetch('/api/users/home', {
      method: 'GET',
    });

    const data = await userRaw.json();

    if (data.user) {
      document.getElementById(
        'usersalute'
      ).innerHTML = `Welcome, ${data.user.name} - ${data.user.username}`;
      document.getElementById(
        'userdata'
      ).innerHTML = `<ul class="list-group mx-auto">
      <li class="list-group-item list-group-item-dark">Nombre: ${data.user.name}</li>
      <li class="list-group-item list-group-item-dark">Apellidos: ${data.user.surname}</li>
      <li class="list-group-item list-group-item-dark">Address: ${data.user.address}</li>
      <li class="list-group-item list-group-item-dark">phone: ${data.user.phone}</li>
      </ul>`;
      const image = await fetch(
        '/api/users/userimage/' + data.user.profilePic,
        {
          method: 'GET',
        }
      );
      console.log(image.url);
      document.getElementById('useravatar').innerHTML = `
      <img src="${image.url}" class="d-block w-25 rounded mx-auto d-block"alt="">
      `;
    } else {
      location.href = '/api/users/login';
    }
  } catch (error) {
    document.querySelector('body').innerHTML = error;
  }
})();
