const https = require('https');

function fetch(url) {
   return new Promise((resolve, reject) => {
      let data = '';

      https
         .get(url, res => {
            res.on('data', chunk => (data += chunk));
            res.on('end', () => {
               try {
                  resolve(JSON.parse(data));
               } catch (err) {
                  reject(err);
               }
            });
         })
         .on('error', err => reject(err));
   });
}

module.exports = fetch;
