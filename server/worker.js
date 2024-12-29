import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initializeClusterAdapter } from '../adapters/socketClusterAdapter.js';
import { initializeDatabase } from '../config/db.js';
import { handleChatMessage } from '../controllers/chatController.js';
import mainRoutes from '../routes/mainRoutes.js';

export const setupWorker = async () => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, { connectionStateRecovery: {} });

  const db = await initializeDatabase();
  io.adapter(initializeClusterAdapter());

  app.use(mainRoutes);

  io.on('connection', (socket) => handleChatMessage(socket, db));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
};
