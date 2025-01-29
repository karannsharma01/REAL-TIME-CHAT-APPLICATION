const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let usersTyping = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('send_message', (data) => {
    io.in(data.room).emit('receive_message', data);
  });

  socket.on('typing', ({ room, username, typing }) => {
    if (typing && !usersTyping.includes(username)) {
      usersTyping.push(username);
    } else if (!typing) {
      usersTyping = usersTyping.filter((user) => user !== username);
    }
    io.in(room).emit('typing_status', usersTyping);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
