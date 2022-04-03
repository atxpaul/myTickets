const socket = io('localhost:8080');

socket.on('messages', (data) => {
  console.log(data);

  console.log(data);
  render(data);
});

function render(data) {
  const html = data
    .map((elem, index) => {
      return `<div>
        <img class="img-fluid img-thumbnail" src="${elem.author.avatar}" style="width: 50px;">
        <strong>${elem.author.alias}</strong> [${elem.date}]
        <em>${elem.text}</em></div>`;
    })
    .join(' ');
  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
  const message = {
    username: document.getElementById('email').value,
    text: document.getElementById('message').value,
  };
  socket.emit('new-message', message);
  return false;
}
