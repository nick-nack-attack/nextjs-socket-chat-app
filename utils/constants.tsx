const appName = 'blyatChat';
const botName = 'Bot';
const welcomeMsg = `Welcome to ${appName}`;
const userJoinMsg = 'has joined the chat';
const disconnectMsg = 'has left the chat';
const serverConnectMsg = 'Biscuits are baking on port';

const SOCKET_ACTIONS = {
  connect: 'connection',
  join: 'joinRoom',
  message: 'message',
  disconnect: 'disconnect',
  chat: 'chatMessage',
  roomUsers: 'roomUsers'
}

module.exports = {
  botName,
  welcomeMsg,
  userJoinMsg,
  disconnectMsg,
  serverConnectMsg,
  SOCKET_ACTIONS
};
