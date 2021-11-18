import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer()

const ws = new Server(server, {
  cors: {
    origin: '*',
  }
});

ws.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    ws.emit('chat message', msg);
  });
});

export default ws;