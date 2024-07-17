const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('create or join', (room) => {
    const clients = io.sockets.adapter.rooms[room] || { length: 0 };
    const numClients = clients.length;

    if (numClients === 0) {
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      socket.join(room);
      socket.emit('joined', room);
      io.to(room).emit('ready');
    } else {
      socket.emit('full', room);
    }
  });

  socket.on('message', (message, room) => {
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
