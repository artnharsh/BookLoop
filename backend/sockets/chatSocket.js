const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*", // Allow all origins for local development
    },
  });

  io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    // 1. User joins the socket server with their personal ID
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
    });

    // 2. User joins a specific chat room (based on listing ID)
    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined Room: ' + room);
    });

    // 3. Handle incoming new message
    socket.on('new message', (newMessageReceived) => {
      let chatReceiver = newMessageReceived.receiver._id;

      if (!chatReceiver) return console.log('chat.receiver not defined');

      // Emit the message to the receiver's personal socket room
      socket.in(chatReceiver).emit('message received', newMessageReceived);
    });

    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED');
    });
  });
};

module.exports = initSocket;