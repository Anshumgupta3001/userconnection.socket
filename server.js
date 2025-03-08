// File: backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let totalUsers = 0;
let messages = []; // Store messages history

io.on('connection', (socket) => {
  console.log('A user connected');
  totalUsers++;
  
  // Broadcast total users to all clients
  io.emit('totalUsersUpdate', totalUsers);
  
  // Send message history to newly connected user
  socket.emit('messageHistory', messages);
  
  // Listen for new messages
  socket.on('sendMessage', (messageData) => {
    // Add message to history
    messages.push(messageData);
    
    // Broadcast to all clients
    io.emit('newMessage', messageData);
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    totalUsers--;
    
    // Broadcast updated total users to all clients
    io.emit('totalUsersUpdate', totalUsers);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});