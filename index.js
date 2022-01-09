const { Client, Intents } = require('discord.js');
require('dotenv').config();
const { sendMessage, apiCommand, missingPermissions } = require('./functions');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = '!b';
const embedColor = '#7289DA';
const nbEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const commands = {
   help: {
      description:
         "Affiche la liste des commandes disponibles ou la syntaxe d'une commande si le nom de la commande est spécifiée en paramètre.",
      syntax: 'help <commande?>',
      run: (msg, [command]) => {
         if (command) {
            if (!commands[command]) {
               sendMessage(
                  `La commande \`${prefix} ${command}\` n'existe pas.\n\`!b help\` pour voir la liste des commandes.`,
                  msg.channel
               );
               return;
            }
            sendMessage(
               `Syntaxe de la commande \`${prefix} ${command}\` :\n\`${prefix} ${commands[command].syntax}\``,
               msg.channel
            );
         } else {
            const missPermissions = missingPermissions(msg, ['EMBED_LINKS']);
            if (missPermissions) {
               sendMessage(missPermissions, msg.channel);
               return;
            }

            sendMessage(
               {
                  embeds: [
                     {
                        title: 'Liste des commandes',
                        color: embedColor,
                        fields: Object.entries(commands).map(([command, { description }]) => ({
                           name: `${prefix} ${command}`,
                           value: description,
                        })),
                     },
                  ],
               },
               msg.channel
            );
         }
      },
   },
   ping: {
      description: 'Renvoie `pong`.',
      syntax: 'ping',
      run: msg => sendMessage('pong', msg.channel),
   },
   poll: {
      description: 'Crée un sondage 📊',
      syntax: 'poll "<question>" "free-answer"|"<réponse_1?>" "<réponse_2?>"',
      run: async (msg, [question, ...answersArr]) => {
         const missPermissions = missingPermissions(msg, [
            'ADD_REACTIONS',
            'READ_MESSAGE_HISTORY',
         ]);
         if (missPermissions) {
            sendMessage(missPermissions, msg.channel);
            return;
         }

         if (!question) {
            sendMessage(
               `Ecrit ta commande sous la forme\n\`${prefix} ${commands.poll.syntax}\``,
               msg.channel
            );
            return;
         }

         if (answersArr[0] === 'free-answer') {
            sendMessage(
               `**📊 ${question.replace(/\*\*/, '\\*\\*')}**\nLa réponse est libre.`,
               msg.channel
            );
         } else if (answersArr.length > 0) {
            if (answersArr.length > 10) {
               sendMessage('Tu peux mettre maximum 10 réponses.', msg.channel);
               return;
            }
            const poll = await sendMessage(
               {
                  content: `**📊 ${question.replace(/\*\*/, '\\*\\*')}**`,
                  embeds: [
                     {
                        color: embedColor,
                        description: answersArr
                           .map((answer, i) => `\n${nbEmojis[i + 1]} ${answer}`)
                           .join(''),
                     },
                  ],
               },
               msg.channel
            );
            if (!poll) return;
            for (let i = 0; i < answersArr.length; i++) {
               poll.react(nbEmojis[i + 1]);
            }
         } else {
            const poll = await sendMessage(
               `**📊 ${question.replace(/\*\*/, '\\*\\*')}**`,
               msg.channel
            );
            if (!poll) return;
            poll.react('👍');
            poll.react('👎');
         }
      },
   },
   joke: {
      description: 'Génère une blague aléatoire.',
      syntax: 'joke',
      run: msg =>
         apiCommand('https://api.blablagues.net/?rub=blagues', msg, data => {
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
         }),
   },
   meme: {
      description: 'Génère un meme aléatoire.',
      syntax: 'meme',
      run: msg =>
         apiCommand(
            'https://meme-api.herokuapp.com/gimme',
            msg,
            ({ url }) => (url ? url : false),
            ['EMBED_LINKS']
         ),
   },
   activity: {
      description: 'Tu ne sais pas quoi faire ? Je vais te donner une idée...',
      syntax: 'activity',
      run: msg =>
         apiCommand('https://www.boredapi.com/api/activity/', msg, ({ activity }) =>
            activity ? activity : false
         ),
   },
};

client.on('ready', () => {
   console.log('Le bot est en ligne !');
});

client.on('messageCreate', msg => {
   if (msg.author.bot) return;

   const matchCommand = msg.content.match(/^!b (\w+)(?: +)?(.+)?$/);
   if (msg.content === prefix) {
      commands.help.run(msg, []);
      return;
   } else if (!matchCommand) {
      return;
   }

   const [match, command, param = ''] = matchCommand;
   const run = commands[command]?.run;

   if (!param.match(/^[^" ]+ *$|^ *(?:"[^"]+" *)*$/)) {
      sendMessage(
         `La syntaxe des paramètres est mauvaise, écrit ta commande sous la forme\n\`${prefix} <commande> "<paramètre_1?>" "<paramètre_2?>"\``,
         msg.channel
      );
      return;
   }

   const params = [];
   for (const match of param.matchAll(/^([^" ]+) *$|"(.+?)"(?: )*/g)) {
      params.push(match[1] ? match[1] : match[2]);
   }

   if (run) {
      run(msg, params);
   } else {
      sendMessage(
         "Cette commande n'existe pas.\n`!b help` pour voir la liste des commandes.",
         msg.channel
      );
   }
});

client.login(process.env.TOKEN);
