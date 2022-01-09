const https = require('https');
const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

function fetch(url) {
   return new Promise((resolve, reject) => {
      let data = '';

      https
         .get(url, res => {
            res.on('data', chunk => (data += chunk));
            res.on('end', () => resolve(JSON.parse(data)));
         })
         .on('error', err => reject(err));
   });
}

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
               msg.channel.send(
                  `La commande \`${prefix} ${command}\` n'existe pas.\n\`!b help\` pour voir la liste des commandes.`
               );
               return;
            }
            msg.channel.send(
               `Syntaxe de la commande \`${prefix} ${command}\` :\n\`${prefix} ${commands[command].syntax}\``
            );
         } else {
            msg.channel.send({
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
            });
         }
      },
   },
   ping: {
      description: 'Renvoie `pong`.',
      syntax: 'ping',
      run: msg => {
         msg.channel.send('pong');
      },
   },
   poll: {
      description: 'Crée un sondage 📊',
      syntax: 'poll "<question>" "free-answer"|"<réponse_1?>" "<réponse_2?>"',
      run: async (msg, [question, ...answersArr]) => {
         if (!question) {
            msg.channel.send(
               `Ecrit ta commande sous la forme\n\`${prefix} ${commands.poll.syntax}\``
            );
            return;
         }

         if (answersArr[0] === 'free-answer') {
            msg.channel.send(
               `**📊 ${question.replace(/\*\*/, '\\*\\*')}**\nLa réponse est libre.`
            );
         } else if (answersArr.length > 0) {
            if (answersArr.length > 10) {
               msg.channel.send('Tu peux mettre maximum 10 réponses.');
               return;
            }
            const poll = await msg.channel.send({
               content: `**📊 ${question.replace(/\*\*/, '\\*\\*')}**`,
               embeds: [
                  {
                     color: embedColor,
                     description: answersArr
                        .map((answer, i) => `\n${nbEmojis[i + 1]} ${answer}`)
                        .join(''),
                  },
               ],
            });
            for (let i = 0; i < answersArr.length; i++) {
               poll.react(nbEmojis[i + 1]);
            }
         } else {
            const poll = await msg.channel.send(
               `**📊 ${question.replace(/\*\*/, '\\*\\*')}**`
            );
            poll.react('👍');
            poll.react('👎');
         }
      },
   },
   joke: {
      description: 'Génère une blague aléatoire.',
      syntax: 'joke',
      run: async msg => {
         msg.channel.sendTyping();
         let success = false;

         for (let i = 0; i < 2; i++) {
            const data = await fetch('https://api.blablagues.net/?rub=blagues').catch(
               () => null
            );
            if (!data) {
               msg.channel.send('Impossible de se connecter au serveur...');
               success = true;
               break;
            }

            const {
               data: { content },
            } = data;

            if (
               content.text_head ||
               (content.text_hidden && !content.source && !content.media && !content.embed)
            ) {
               msg.channel.send(
                  `${content.text_head ? `${content.text_head}\n` : ''}${
                     content.text ? `${content.text}\n` : ''
                  }${content.text_hidden ? `||${content.text_hidden}||` : ''}`
               );
               success = true;
               break;
            }
         }

         if (!success)
            msg.channel.send(
               "Désolé, je n'ai pas d'inspiration pour le moment...\nRéessaie dans quelques instants."
            );
      },
   },
   meme: {
      description: 'Génère un meme aléatoire.',
      syntax: 'meme',
      run: async msg => {
         msg.channel.sendTyping();
         let success = false;

         for (let i = 0; i < 2; i++) {
            const data = await fetch('https://meme-api.herokuapp.com/gimme').catch(() => null);
            if (!data) {
               msg.channel.send('Impossible de se connecter au serveur...');
               success = true;
               break;
            }

            if (data.url) {
               msg.channel.send(data.url);
               success = true;
               break;
            }
         }

         if (!success)
            msg.channel.send(
               "Désolé, je n'ai pas d'inspiration pour le moment...\nRéessaie dans quelques instants."
            );
      },
   },
   activity: {
      description: 'Tu ne sais pas quoi faire ? Je vais te donner une idée...',
      syntax: 'activity',
      run: async msg => {
         msg.channel.sendTyping();
         let success = false;

         for (let i = 0; i < 2; i++) {
            const data = await fetch('https://www.boredapi.com/api/activity/').catch(
               () => null
            );
            if (!data) {
               msg.channel.send('Impossible de se connecter au serveur...');
               success = true;
               break;
            }

            if (data.activity) {
               msg.channel.send(data.activity);
               success = true;
               break;
            }
         }

         if (!success)
            msg.channel.send(
               "Désolé, je n'ai pas d'inspiration pour le moment...\nRéessaie dans quelques instants."
            );
      },
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
      msg.channel.send(
         `La syntaxe des paramètres est mauvaise, écrit ta commande sous la forme\n\`${prefix} <commande> "<paramètre_1?>" "<paramètre_2?>"\``
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
      msg.channel.send(
         "Cette commande n'existe pas.\n`!b help` pour voir la liste des commandes."
      );
   }
});

client.login(process.env.TOKEN);
