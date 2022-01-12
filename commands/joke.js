const api = require('./functions/api');

module.exports.run = message => {
   api('https://api.blablagues.net/?rub=blagues', message.channel, data => {
      const content = data?.data?.content;

      if (
         content &&
         (content.text_head || content.text) &&
         !content.source &&
         !content.media &&
         !content.embed
      ) {
         return `${content.text_head ? `${content.text_head}\n` : ''}${
            content.text ? `${content.text}\n` : ''
         }${content.text_hidden ? `||${content.text_hidden}||` : ''}`;
      } else {
         return false;
      }
   });
};

module.exports.help = {
   description: 'Génère une blague aléatoire.',
   syntax: 'joke',
};
