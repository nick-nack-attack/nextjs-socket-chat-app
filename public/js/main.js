const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

/**
 * Get username and room from URL
 */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

/**
 * Join chatroom
 */
socket.emit('joinRoom', { username, room });

/**
 * Get room and users
 */
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

/**
 * Message from server
 */
socket.on('message', (message) => {
  outputMessage(message);

  /**
   * Scroll down
   */
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/**
 * Message submit
 */
chatForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  /**
   * Get message text
   */
  const msg = ev.target.elements.msg.value;

  /**
   * Emit message to server
   */
  socket.emit('chatMessage', msg);

  /**
   * Clear message
   */
  ev.target.elements.msg.value = '';
  ev.target.elements.msg.focus();
})

/**
 * Output message to DOM
 */
function outputMessage(message) {
  const div = document.createElement('div');

  div.classList.add('message');

  div.innerHTML = `
    <p class="meta"><b>${message.username}</b> <span>(${message.time})</span></p>
    <p class="text">
        ${message.modified} <span class="strike-through">${message.original ? message.original : ''}</span>
    </p>
  `;

  document.querySelector('.chat-messages').appendChild(div);
}

/**
 * Add room name to DOM
 */
function outputRoomName(room) {
  roomName.innerText = room;
}

/**
 * Add users to DOM
 */
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

/**
 * Prompt user before leaving chat room
 */
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
