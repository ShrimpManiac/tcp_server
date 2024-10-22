import net from 'net';
import dotenv from 'dotenv';
import initServer from './init/index.js';

dotenv.config();

const PORT = process.env.PORT;

const server = net.createServer((socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}: ${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(data);
  });

  socket.on('end', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}: ${socket.remotePort}`);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

initServer()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`TCP server listening on port ${PORT}`);
      console.log(server.address());
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
