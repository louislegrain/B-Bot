module.exports = arr => {
   let result = '';
   for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1 && arr.length > 1) {
         result += ' et ';
      } else if (i > 0) {
         result += ', ';
      }
      result += arr[i];
   }
   return result;
};
