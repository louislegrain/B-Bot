const api = require('./functions/api');

module.exports.run = message => {
   api('https://meme-api.herokuapp.com/gimme', message.channel, ({ url }) =>
      url ? url : false
   );
};

module.exports.help = {
   description: 'Génère un meme aléatoire.',
   syntax: 'meme',
};

module.exports.aliases = /^m[eêéè]me$/;

module.exports.permissions = ['EMBED_LINKS'];
