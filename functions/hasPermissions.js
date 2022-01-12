const sendMessage = require('./sendMessage');
const turnArrayIntoText = require('./turnArrayIntoText');
const { permissions } = require('../config.json');

module.exports = (message, requiredPermissions = [], sendPermsErrMessage = true) => {
   if (requiredPermissions.length === 0) return true;

   const botPermissions = message.guild.me.permissionsIn(message.channel);
   const missingPermissions = [];

   requiredPermissions.forEach(permission => {
      if (!botPermissions.has(permission)) missingPermissions.push(permission);
   });

   if (sendPermsErrMessage && missingPermissions.length > 0) {
      const plural = missingPermissions.length > 1;
      sendMessage(
         `J'ai besoin ${plural ? 'des' : 'de la'} permission${
            plural ? 's' : ''
         } ${turnArrayIntoText(
            missingPermissions.map(permission => `**${permissions[permission]}**`)
         )} pour exécuter cette commande.`,
         message.channel
      );

      return false;
   } else if (missingPermissions.length > 0) {
      return false;
   }

   return true;
};
