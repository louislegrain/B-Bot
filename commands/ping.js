const sendMessage = require('../functions/sendMessage');

module.exports.run = message => {
   sendMessage('pong', message.channel);
};

module.exports.help = {
   description: 'Renvoie `pong`',
   syntax: 'ping',
};
