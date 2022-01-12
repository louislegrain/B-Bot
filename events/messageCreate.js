const sendMessage = require('../functions/sendMessage');
const getCommand = require('../functions/getCommand');
const hasPermissions = require('../functions/hasPermissions');
const { prefix } = require('../config.json');

module.exports = (client, message) => {
   if (message.author.bot) return;

   const matchCommandRegex = new RegExp(
      `^ *${prefix}(?: +([^\\r\\n\\t\\f\\v "]+))? *((?: *"[^"]+")+|[^\\r\\n\\t\\f\\v "]+)? *$`,
      'i'
   );
   const matchCommand = message.content.match(matchCommandRegex);

   if (!matchCommand) {
      if (message.content.trim().startsWith(prefix)) {
         sendMessage(
            `Je n'arrive pas à comprendre ta commande.\nEcrit ta commande sous la forme \`${prefix} <commande> "<paramètre_1?>" "<paramètre_2?>"\``,
            message.channel
         );
      }

      return;
   }

   let [, cmd = '', params = ''] = matchCommand;
   params = params.split(/ *" */).filter(param => param);

   const { run: command, permissions } = getCommand(client, cmd);

   if (!command) {
      sendMessage(
         `Cette commande n\'existe pas.\n\`${prefix} help\` pour voir la liste des commandes.`,
         message.channel
      );
      return;
   }

   if (!hasPermissions(message, permissions)) return;

   command(message, params, cmd, client);
};
