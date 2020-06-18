const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();
const connections = [];
const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  connections.push(socket);

  socket.on('move', (directionObject) => {
    console.log(directionObject);
    connections.forEach((connection) => {
      if (connection !== socket) {
        connection.emit('move', directionObject);
      }
    });
  });

  socket.on('disconnect', () => {});
});

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  connections.forEach((connection) => {
    connection.emit('FromAPI', response);
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));
