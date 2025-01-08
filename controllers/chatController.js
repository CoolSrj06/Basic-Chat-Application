import { faker } from '@faker-js/faker';
var dataStore = {
  list: []
};

export const handleChatMessage = async (socket, db) => {
  const updateOnlineUsers = () => {
    socket.server.emit('onlineUsers', dataStore.list);
  };
  
  // Broadcast to all the users except the newly connected user
  socket.broadcast.emit('User Status', 'A new user has joined the chat!');
  console.log(`A user connected to ${socket.id}`);
  const fakeUserName = faker.internet.username()
  dataStore.list.push({sid: socket.id, username: fakeUserName}); 
  
  // Handle online users
  socket.server.emit('onlineUsers', dataStore);

  // Handle chat message events
  socket.on('chat message', async (msg, clientOffset, callback) => {
    const messageWithUser = `<strong>${fakeUserName}</strong>: ${msg}`;
    let result;
    try {
      result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', messageWithUser, clientOffset);
    } catch (e) {
      if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
        callback();
      }
      return;
    }
    
    // Include the offset with the message and broadcast it to all clients
    socket.server.emit('chat message', messageWithUser, result.lastID);
    callback();
  });

  // If the connection state recovery was not successful
  if (!socket.recovered) {
    try {
      await db.each(
        'SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      );
    } catch (e) {
      console.error('Error retrieving messages:', e.message);
    }
  }

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    const index = dataStore.list.findIndex(item => item.sid === socket.id);
    if (index > -1) {
      dataStore.list.splice(index, 1);
    }
    // Notify others about the disconnection
    socket.broadcast.emit('User Status', 'A user has left the chat.');
    // Handle online users
    socket.server.emit('onlineUsers', dataStore);
  });

  // Handle User is typing 
  socket.on('typing', (callback) => {
    socket.broadcast.emit('typing', `${fakeUserName} is typing...`);
    callback();
  });

   // Listen for "stopTyping" events
   socket.on('stopTyping', () => {
    console.log('stopTyping event received');
    socket.broadcast.emit('typing', ''); // Clear the typing message
  });

  
};
  