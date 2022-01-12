const fetch = require('node-fetch');
const sendMessage = require('../../functions/sendMessage');

module.exports = async (url, channel, messageFunc) => {
   try {
      await channel.sendTyping();

      const res = await fetch(url);
      const data = await res.json();

      const message = messageFunc(data);

      if (message) {
         sendMessage(message, channel);
      } else {
         sendMessage(
            "Désolé, je n'ai pas d'inspiration pour le moment...\nRéessaie dans quelques instants.",
            channel
         );
      }
   } catch (e) {
      sendMessage('Impossible de se connecter au serveur...', channel);
   }
};
