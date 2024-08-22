import http from 'http';
import app from './src/config/express.config.js';
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: '*'
})
io.on('connection', (socket) => {
  socket.on('message-sent', (data) => {
    socket.broadcast.emit('message-received', data)
  })
})

server.listen(49153, '127.0.0.1', (err) => {
  if (!err) {
    console.log('server is connected');
  }
})