const { Collection } = require('discord.js');
const { client } = global;
const { Prefix, Owners, DisableCooldownsForAdmins } = client.settings;
const { staffRoles, botYt, unAuthorizedMessages } = client.guildSettings;
const embed = require('../utils/Embed.js');

/**
 * @param { Message } message 
 */

module.exports = async (message) => {

///Process
    if (message.author.bot) return;
    if(!message.content.startsWith(Prefix)) return;

    let args = message.content.slice(Prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLocaleLowerCase();
    let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && (commandName && cmd.aliases.has(commandName)));
    let Embed = embed(message.author.username, message.author.avatarURL({ dynamic: true }), false);

    if(!command) return;

///Controls

    //Developer Control
    if (command.developer && !Owners.includes(message.author.id)) {
        
        if (!command.returnMsg) return;
        else return message.channel.error(message, command.returnMsg, { timeout: 10000 });
        
    };

    //Server Owner Control
    if (command.guildOwner && message.channel.type == "text" && !Owners.includes(message.author.id) && message.guild.owner.id !== message.author.id) {
        
        if (unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu sadece sunucu sahibi kullana bilir!`, { timeout: 10000 });
        else return;
    };

    //Permission Control
    if (command.permission && message.channel.type == "text" && !Owners.includes(message.author.id) && !message.member.hasPermission(command.permission) && !message.member.roles.cache.has(botYt)) {
        
        if (unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
        else return;
        
    };

    //Staff Control
    if (command.staff && message.channel.type == "text" && !Owners.includes(message.author.id) && !message.member.hasPermission('MANAGE_ROLES') && !message.member.roles.cache.has(botYt) && !staffRoles.some(role => message.member.roles.cache.has(role))) {

        if (unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
        else return;

    };

    //Guild Control
    if (command.guildOnly && message.channel.type == "dm") {

        if (command.developer || command.guildOwner || command.permission || command.staff) return;
        else return message.channel.error(message, `Bu komut yalnızca sunucu kanallarında çalışa bilmektedir!`);

    };

//Operations

    //Cooldowns
    if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
  
    let timestamps = client.cooldowns.get(command.name);
    let cooldownAmount = (command.cooldown) * 1000;
    let now = Date.now();
  
    if (timestamps.has(message.author.id)) {
        
        let expirationtime = timestamps.get(message.author.id) + cooldownAmount;
        let timeleft = (expirationtime - now) / 1000;

        if(DisableCooldownsForAdmins) {
        
            if (expirationtime > now && !Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, `Bu komutu tekrar kullana bilmek için lütfen **${parseInt(timeleft) == 0 ? 1 : parseInt(timeleft)} saniye** bekleyin!`, { timeout: 5000 });
        
        } else {
        
            if (expirationtime > now && !Owners.includes(message.author.id)) return message.channel.error(message, `Bu komutu tekrar kullana bilmek için lütfen **${parseInt(timeleft) == 0 ? 1 : parseInt(timeleft)} saniye** bekleyin!`, { timeout: 5000 });

        };
        
    };
  
    timestamps.set(message.author.id, now);
    client.wait(cooldownAmount).then(() => timestamps.delete(message.author.id));

    //Running Commands
    try { 

        command.execute(client, message, args, Embed); 

    } catch (e) {
            
        message.channel.error(message, `Hay Aksi, bu komut çalıştırılırken bir hata oluştu. Botun yapımcıları durumla ilgilenecektir, lütfen biraz sonra tekrar deneyin!`, { react: true });
        Owners.filter(owner => owner !== '').forEach(async (owner, index) => {

            await client.wait(index * 500);
            client.users.cache.get(owner).send(`
**${message.channel.toString()}** adlı kanalda \`${command.name}\` adlı komut kullanılırken hata oluştu!
Komutu kullanan kişi : **${message.author.tag}** ( \`${message.author.id}\` )
            `);
            for(let i = 0; i < Math.floor(e.stack.length / 2000); i++) {
                client.users.cache.get(owner).send(e.stack.slice(0, 2000), { code: "js", split: true });
            };

        });

    };

};

module.exports.conf = {
    name: "Commands",
    event: "message"
};