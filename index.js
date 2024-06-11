import http from 'http';
import app from './src/config/express.config.js';

const server = http.createServer(app);

server.listen(49153, '127.0.0.1', (err) => {
  if (!err) {
    console.log('server is connected');
  }
})