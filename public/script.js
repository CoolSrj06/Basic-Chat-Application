let counter = 0;

const socket = io({
  auth: {
    serverOffset: 0,
  },
  // enable retries
  ackTimeout: 10000,
  retries: 3,
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typing = document.getElementById('typing');
const onlineUsers = document.getElementById('online-users');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const clientOffset = `${socket.id}-${counter++}`;
    socket.emit('chat message', input.value, clientOffset, () => {
      console.log('Message received by server');
    });
    input.value = '';
  }
});

// Listen for chat messages
socket.on('chat message', (msg, serverOffset) => {
  typing.innerHTML = '';//Clear the typing indicator
  const item = document.createElement('li');
  item.innerHTML = msg; 
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  socket.auth.serverOffset = serverOffset;
});

// Listen for user status messages
socket.on('User Status', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  item.style.color = 'gray'; // Differentiate status messages with color
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// Handle connect/disconnect toggle
const toggleButton = document.getElementById('toggle-btn');

toggleButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (socket.connected) {
    toggleButton.innerText = 'Connect';
    socket.disconnect();
  } else {
    toggleButton.innerText = 'Disconnect';
    socket.connect();
  }
});


input.addEventListener('keydown', function (event) {
  socket.emit('typing'); // Notify the server that the user is typing
});

socket.on('typing', (msg) => {
  // Update the typing indicator with the message received from the server
  const typing = document.getElementById('typing');
  typing.textContent = msg || ''; // Clear the message if it's empty
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('onlineUsers', (dataStore) => {
  console.log(dataStore);
  onlineUsers.innerHTML = ''; // Clear the list of online users before updating it
  dataStore.list.forEach(user => {
    const item = document.createElement('li');
    item.innerHTML = user.username;
    onlineUsers.appendChild(item);
  });
});