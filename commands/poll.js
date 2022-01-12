const sendMessage = require('../functions/sendMessage');
const escapeMarkdown = require('../functions/escapeMarkdown');
const { prefix, mainColor, nbEmojis } = require('../config.json');

module.exports.run = async (message, [question, ...answers]) => {
   if (!question) {
      sendMessage(
         `La question est obligatoire !\n\`${prefix} help poll\` pour en savoir plus.`,
         message.channel
      );
      return;
   }

   if (answers[0] === 'free-answer') {
      sendMessage(
         `**📊 ${escapeMarkdown(question)}**\nLa réponse est libre.`,
         message.channel
      );
   } else if (answers.length > 0) {
      if (answers.length > 10) {
         sendMessage('Tu peux mettre maximum 10 réponses.', message.channel);
         return;
      }
      const poll = await sendMessage(
         {
            content: `**📊 ${escapeMarkdown(question)}**`,
            embeds: [
               {
                  color: mainColor,
                  description: answers
                     .map((answer, i) => `\n${nbEmojis[i + 1]} ${answer}`)
                     .join(''),
               },
            ],
         },
         message.channel
      );
      if (!poll) return;
      for (let i = 0; i < answers.length; i++) {
         poll.react(nbEmojis[i + 1]);
      }
   } else {
      const poll = await sendMessage(`**📊 ${escapeMarkdown(question)}**`, message.channel);
      if (!poll) return;
      poll.react('👍');
      poll.react('👎');
   }
};

module.exports.help = {
   description: 'Crée un sondage 📊',
   syntax: 'poll "<question>" "free-answer"|"<réponse_1?>" "<réponse_2?>"',
};

module.exports.permissions = ['ADD_REACTIONS', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'];
