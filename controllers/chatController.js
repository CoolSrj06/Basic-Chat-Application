export const handleChatMessage = async (socket, db) => {
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
  
      socket.server.emit('chat message', msg, result.lastID);
      callback();
    });
  
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
  };
  