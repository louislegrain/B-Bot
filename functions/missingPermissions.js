const turnArrayIntoText = require('./turnArrayIntoText');

const permissionsFr = {
   CREATE_INSTANT_INVITE: 'Créer une invitation',
   KICK_MEMBERS: 'Expulser des membres',
   BAN_MEMBERS: 'Bannir des membres',
   ADMINISTRATOR: 'Administrateur',
   MANAGE_CHANNELS: 'Gérer les salons',
   MANAGE_GUILD: 'Gérer le serveur',
   ADD_REACTIONS: 'Ajouter des réactions',
   VIEW_AUDIT_LOG: 'Voir les logs du serveur',
   PRIORITY_SPEAKER: 'Voix prioritaire',
   STREAM: 'Vidéo',
   VIEW_CHANNEL: 'Voir les salons',
   SEND_MESSAGES: 'Envoyer des messages',
   SEND_TTS_MESSAGES: 'Envoyer des messages de synthèse vocale',
   MANAGE_MESSAGES: 'Gérer les messages',
   EMBED_LINKS: 'Intégrer des liens',
   ATTACH_FILES: 'Joindre des fichiers',
   READ_MESSAGE_HISTORY: 'Voir les anciens messages',
   MENTION_EVERYONE: 'Mentionner @everyone, @here et tous les rôles',
   USE_EXTERNAL_EMOJIS: 'Utiliser des émojis externes',
   CONNECT: 'Se connecter',
   SPEAK: 'Parler',
   MUTE_MEMBERS: 'Mettre en sourdine des membres',
   DEAFEN_MEMBERS: 'Mettre en sourdine des membres',
   MOVE_MEMBERS: 'Déplacer des membres',
   USE_VAD: 'Utiliser la Détection de la voix',
   CHANGE_NICKNAME: 'Changer le pseudo',
   MANAGE_NICKNAMES: 'Gérer les pseudos',
   MANAGE_ROLES: 'Gérer les rôles',
   MANAGE_WEBHOOKS: 'Gérer les webhooks',
   MANAGE_EMOJIS_AND_STICKERS: 'Gérer les emojis et les autocollants',
   USE_APPLICATION_COMMANDS: "Utiliser les commandes de l'application",
   MANAGE_EVENTS: 'Gérer les événements',
   MANAGE_THREADS: 'Gérer les fils',
   CREATE_PUBLIC_THREADS: 'Créer des fils publics',
   CREATE_PRIVATE_THREADS: 'Créer des fils privés',
   USE_EXTERNAL_STICKERS: 'Utiliser des autocollants externes',
   SEND_MESSAGES_IN_THREADS: 'Envoyer des messages dans les fils',
   START_EMBEDDED_ACTIVITIES: 'Commencer les activités',
   MODERATE_MEMBERS: 'Exclure temporairemement des membres',
};

function missingPermissions(msg, requiredPermissions) {
   const permissions = msg.member.guild.me.permissions;
   const missingPermissionsArr = [];

   requiredPermissions.forEach(permission => {
      if (!permissions.has(permission)) missingPermissionsArr.push(permission);
   });

   if (missingPermissionsArr.length === 0) return null;

   const plural = missingPermissionsArr.length > 1;

   return `J'ai besoin ${plural ? 'des' : 'de la'} permission${
      plural ? 's' : ''
   } ${turnArrayIntoText(
      missingPermissionsArr.map(permission => `**${permissionsFr[permission]}**`)
   )} pour exécuter cette commande.`;
}

module.exports = missingPermissions;
