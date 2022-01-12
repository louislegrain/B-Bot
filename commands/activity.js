const api = require('./functions/api');

module.exports.run = message => {
   api('https://www.boredapi.com/api/activity/', message.channel, ({ activity }) =>
      activity ? activity : false
   );
};

module.exports.help = {
   description: 'Tu ne sais pas quoi faire ? Je vais te donner une idée...',
   syntax: 'activity',
};
