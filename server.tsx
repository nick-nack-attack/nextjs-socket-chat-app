const express = require('express');
const { Express, Request, Response } = require('express');
const app = express();

const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const {
  botName,
  welcomeMsg,
  disconnectMsg,
  serverConnectMsg,
  userJoinMsg,
  SOCKET_ACTIONS
} = require('./utils/constants.tsx');
const {formatMessage, getApprovedMessage} = require('./utils/messages.tsx');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.tsx');

/**
 * Set static folder
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Run when a client connects
 */
io.on(SOCKET_ACTIONS.connect, (socket) => {
  socket
    .on(SOCKET_ACTIONS.join, ({username, room}) => {
      const user = userJoin(socket.id, `Comrade ${username}`, room);

      socket
        .join(user.room);

      /**
       * Welcome current user
       */
      socket
        .emit(SOCKET_ACTIONS.message, formatMessage(botName, `${welcomeMsg}, ${user.username}!`));

      /**
       * Broadcast when a user connects
       */
      socket
        .broadcast
        .to(user.room)
        .emit(SOCKET_ACTIONS.message, formatMessage(botName, `${user.username} ${userJoinMsg}`));

      /**
       * Send users and room info
       */
      io
        .to(user.room)
        .emit(SOCKET_ACTIONS.roomUsers, {
          room: user.room,
          users: getRoomUsers(user.room)
      });
    })

  /**
   * Listen for chat message
   */
  socket.on(SOCKET_ACTIONS.chat, (msg) => {
    const user = getCurrentUser(socket.id);

    const approvedMessage = getApprovedMessage();

    const correctMessage = `What ${user.username} really meant to say was "${approvedMessage}" instead of`;

    io
      .to(user.room)
      .emit(SOCKET_ACTIONS.message, formatMessage(user.username, correctMessage, msg));
  })

  /**
   * Runs when client disconnects
   */
  socket
    .on(SOCKET_ACTIONS.disconnect, () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room)
          .emit(SOCKET_ACTIONS.message, formatMessage(botName, `${user.username} ${disconnectMsg}`));
      }

      /**
       * Send users and room info
       */
      io.to(user.room).emit(SOCKET_ACTIONS.roomUsers, {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`${serverConnectMsg} ${PORT}`));
