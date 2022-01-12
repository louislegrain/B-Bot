module.exports = (client, name) => {
   name = name.toLowerCase();
   let realCmdName = name;
   let command = client.commands.get(name);
   if (!command) {
      realCmdName = client.aliases.find((cmdName, regex) => regex.test(name));
      command = client.commands.get(realCmdName);
   }

   return {
      name: realCmdName,
      run: command,
      help: client.helps.get(realCmdName),
      permissions: client.permissions.get(realCmdName),
   };
};
