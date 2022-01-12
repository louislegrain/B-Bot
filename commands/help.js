const sendMessage = require('../functions/sendMessage');
const getCommand = require('../functions/getCommand');
const hasPermissions = require('../functions/hasPermissions');
const { prefix, mainColor } = require('../config.json');

module.exports.run = (message, params, cmd, client) => {
   if (params[0]) {
      const { name, help } = getCommand(client, params[0]);
      if (help) {
         sendMessage(
            `Syntaxe de la commande \`${prefix} ${name}\` :\n\`${prefix} ${help.syntax}\``,
            message.channel
         );
      } else {
         sendMessage(
            `La commande \`${prefix} ${params[0]}\` n'existe pas.\n\`${prefix} help\` pour voir la liste des commandes.`,
            message.channel
         );
      }
   } else if (hasPermissions(message, ['EMBED_LINKS'], false)) {
      sendMessage(
         {
            embeds: [
               {
                  title: 'Liste des commandes',
                  color: mainColor,
                  fields: [...client.helps].map(([name, { description }]) => ({
                     name: `${prefix} ${name}`,
                     value: description,
                  })),
               },
            ],
         },
         message.channel
      );
   } else {
      sendMessage(
         `**__Liste des commandes__**\n${[...client.helps]
            .map(([name, { description }]) => `\n**${prefix} ${name}**\n${description}`)
            .join('')}`,
         message.channel
      );
   }
};

module.exports.help = {
   description: 'Affiche la liste des commandes.',
   syntax: 'help <commande?>',
};

module.exports.aliases = /^$/;
