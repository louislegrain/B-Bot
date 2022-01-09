const fetch = require('./fetch');
const sendMessage = require('./sendMessage');
const missingPermissions = require('./missingPermissions');

async function apiCommand(url, msg, messageFunc, permissions) {
   if (permissions) {
      const missPermissions = missingPermissions(msg, permissions);
      if (missPermissions) {
         sendMessage(missPermissions, msg.channel);
         return;
      }
   }

   try {
      await msg.channel.sendTyping();
   } catch (e) {
      return;
   }
   let success = false;

   for (let i = 0; i < 2; i++) {
      const data = await fetch(url).catch(() => null);
      if (!data) {
         sendMessage('Impossible de se connecter au serveur...', msg.channel);
         success = true;
         break;
      }

      const message = messageFunc(data);

      if (message) {
         sendMessage(message, msg.channel);
         success = true;
         break;
      }
   }

   if (!success)
      sendMessage(
         "Désolé, je n'ai pas d'inspiration pour le moment...\nRéessaie dans quelques instants.",
         msg.channel
      );
}

module.exports = apiCommand;
