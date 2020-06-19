const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();
const connections = [];
const server = http.createServer(app);

const io = socketIo(server);
io.set('heartbeat interval', 5);

const players = {};

const positionPrey = () => {
  const preyLeft = Math.floor(Math.random() * 78);
  const preyTop = Math.floor(Math.random() * 78);
  console.log(preyLeft, preyTop);

  return { preyLeft, preyTop };
};

var preyPosition = positionPrey();
const colors = ['#ff0', '#0f0', '#00f', '#000'];
let count = 0;
io.on('connection', (socket) => {
  console.log('New client connected');
  const newConnectionInfo = {
    score: 0,
    hasStarted: false,
    speed: 1000,
    color: colors[count % colors.length],
    isDirectionChanged: true,
    direction: 38,
    self: false,
  };
  count++;
  players[socket.id] = newConnectionInfo;

  connections.push(socket);
  //console.log(players);

  // todo
  sendPlayerInformation();

  socket.on('move', (directionObject) => {
    console.log(directionObject);
    connections.forEach((connection) => {
      connection.emit('direction', directionObject);
    });
  });

  socket.on('start', (obj) => {
    obj = JSON.parse(obj);
    players[obj.id].hasStarted = true;
    connections.forEach((connection) => {
      connection.emit('start', JSON.stringify(obj));
    });
  });

  socket.on('pray_caught', (snakeId) => {
    for (const [key, val] of Object.entries(players)) {
      if (key === snakeId) {
        val.score += 1;
        break;
      }
    }

    preyPosition = positionPrey();
    connections.forEach((connection) => {
      connection.emit('new_pray', JSON.stringify(preyPosition));
      connection.emit('scorer', snakeId);
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);

    delete players[socket.id];
  });
});

const sendPlayerInformation = () => {
  connections.forEach((connection) => {
    if (players[connection.id] === undefined) {
      return;
    }
    players[connection.id].self = true;
    connection.emit(
      'player',
      JSON.stringify({
        players,
        preyPosition,
      })
    );
    players[connection.id].self = false;
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));
