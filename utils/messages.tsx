const moment = require('moment');
const approvedMessages = require('./approvedMessages.tsx')

function formatMessage(username, modified, original) {
  return {
    username,
    modified,
    original,
    time: moment().format('h:mm a')
  };
}

function getApprovedMessage() {
  const randomIndex = Math.floor(Math.random() * approvedMessages.length);

  return approvedMessages[randomIndex];
}

module.exports = {formatMessage, getApprovedMessage}
