export const handleChatMessage = async (socket, db) => {
  // Broadcast to all the users except the newly connected user
  socket.broadcast.emit('User Status', 'A new user has joined the chat!');
  console.log(`A user connected to ${socket.id}`);

  // Handle chat message events
  socket.on('chat message', async (msg, clientOffset, callback) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
    } catch (e) {
      if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
        callback();
      }
      return;
    }
    // Include the offset with the message and broadcast it to all clients
    socket.server.emit('chat message', msg, result.lastID);
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
    // Notify others about the disconnection
    socket.broadcast.emit('User Status', 'A user has left the chat.');
});
};
  