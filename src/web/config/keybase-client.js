const fs = require('fs-extra');
const execa = require('execa');

function restructureReactions(reactions) {
  if (reactions) {
    return Object.entries(reactions.reactions).map(([emoji, r]) => ({
      emoji,
      users: Object.entries(r).map(([username, info]) => ({
        username,
        ...info,
      })),
    }));
  }
}

async function readMessages(amount) {
  await execa('keybase', ['chat', 'api', '-i', 'input.json', '-o', 'output.json']);

  const { result } = fs.readJsonSync('./output.json');
  const messages = result.messages.reverse();

  let formattedMessages = [];

  for (var i = 0; i < messages.length; i++) {
    const { msg } = messages[i];

    if (msg.content.type === 'text') {
      formattedMessages.push({
        id: msg.id,
        username: msg.sender.username,
        timestamp: msg.sent_at,
        body: msg.content.text.body,
        reactions: restructureReactions(msg.reactions),
        type: 'text',
      });
    }

    if (msg.content.type === 'attachment') {
      formattedMessages.push({
        id: msg.id,
        username: msg.sender.username,
        timestamp: msg.sent_at,
        body: msg.content.attachment.object.filename,
        mime: msg.content.attachment.object.mimeType,
        type: 'attachment',
      });
    }
  }

  return formattedMessages;
}

async function getTeam() {
  try {
    const { stdout } = await execa('keybase', ['team', 'list-members', '-j']);
    return JSON.parse(stdout);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  readMessages,
  getTeam,
};
