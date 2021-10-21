const { Client, Collection } = require('discord.js');
const client = (global.client = new Client({ fetchAllMembers: true }));
const { readdirSync } = require("fs");
require('discord-buttons')(client);
require('./src/configs/settings.js')(client);
const { Token } = client.settings;

//Collections
client.commands = new Collection();
client.cooldowns = new Collection();

//Handlers
require("./src/handlers/eventHandler.js");
require("./src/handlers/mongoHandler.js");
require("./src/handlers/functions.js")(client);

//Checking Commands
readdirSync(`./src/commands`).filter(async dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./src/commands/${dir}/${file}`);
      await client.commands.set(command.name, command);
      //console.log(`[COMMAND] ${command.name} Loaded!`);
    };
});
  
//Connecting To Client
client.login(Token).then(client => console.log(`[BOT] Connection started`)).catch(async err => {
  console.log(`[BOT] Failed to start connection, trying again`);
  process.exit();
});