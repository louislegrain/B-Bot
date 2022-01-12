const { readdirSync } = require('fs');

module.exports = client => {
   const events = readdirSync('./events').filter(name => name.endsWith('.js'));
   events.forEach(event => {
      const [, name] = event.match(/^(.+)\.js$/);
      const file = require(`../events/${name}`);
      client.on(name, (...args) => file(client, ...args));
   });
};
