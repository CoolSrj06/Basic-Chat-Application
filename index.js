import express from 'express';
import {createServer}   from 'node:http';
import { fileURLToPath } from 'node:url';
import {dirname, join} from 'node:path';
import {Server} from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));//Current URL of file: "C:\Users\SRJ\Documents\Projects\BackEnd Learning\Basic Chat Application"

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '/public/index.html'))
});

io.on('connection', (socket) => {
    socket.on('request', (arg1, callback) => {
        callback({
            status: 'Success',
            message: 'Data Received'
        });
    });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

