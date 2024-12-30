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
  const item = document.createElement('li');
  item.textContent = msg;
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
