function sendMessage(content, channel) {
   return channel.send(content).catch(({ message }) => {
      if (typeof content !== 'string' && message === 'Missing Permissions') {
         return sendMessage(
            "Je n'ai pas les permissions nécessaires pour effectuer cette action.",
            channel
         );
      } else {
         return false;
      }
   });
}

module.exports = sendMessage;
