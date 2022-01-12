async function sendMessage(content, channel) {
   let result = null;

   try {
      result = await channel.send(content);
   } catch (e) {
      result = e;
      if (e.code === 50013 && typeof message !== 'string') {
         sendMessage('Il me manque des permissions pour effectuer cette action.', channel);
      } else {
         console.log("Erreur lors de l'envoi du message !");
      }
   }

   return result;
}

module.exports = sendMessage;
