const { Collection } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = client => {
   client.commands = new Collection();
   client.helps = new Collection();
   client.aliases = new Collection();
   client.permissions = new Collection();

   const commands = readdirSync('./commands').filter(name => name.endsWith('.js'));
   commands.forEach(command => {
      const [, name] = command.match(/^(.+)\.js$/);
      const file = require(`../commands/${name}`);

      client.commands.set(name, file.run);
      if (file.help) client.helps.set(name, file.help);
      if (file.aliases) client.aliases.set(file.aliases, name);
      if (file.permissions) client.permissions.set(name, file.permissions);
   });
};
