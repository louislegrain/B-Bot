const { Client, Intents } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

require('./handlers/events')(client);
require('./handlers/commands')(client);

client.login(process.env.TOKEN);
