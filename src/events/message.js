const { MessageEmbed, Collection } = require('discord.js');
const { client } = global;
const { Prefix, Owners, DisableCooldownsForAdmins } = client.settings;
const { staffRoles, botYt } = client.guildSettings;
const embed = require('../utils/Embed.js');

/**
 * @param { Message } message 
 */

module.exports = async (message) => {

///Process
    if (message.author.bot) return;

    if(!message.content.startsWith(Prefix)) return;

    const args = message.content.slice(Prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLocaleLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    const Embed = embed(message.author.username, message.author.avatarURL({ dynamic: true }), false);

    if(!command) return;

///Controls

    //Developer Control
    if (command.developer && !Owners.includes(message.author.id)) {
        
        if (!command.returnMsg) return;
        else return message.reply(command.returnMsg);
        
    };

    //Server Owner Control
    if (command.guildOwner && message.channel.type == 'text' && message.guild.owner.id !== message.author.id && !Owners.includes(message.author.id)) {
        
        if (!command.returnMsg) return;
        else return message.reply(command.returnMsg);
        
    };

    //Permission Control
    if (command.permission && message.channel.type == 'text' && !message.member.hasPermission(command.permission) && !message.member.hasPermission(8) && !Owners.includes(message.author.id) && !message.member.roles.cache.has(botYt)) {
        
        if (!command.returnMsg) return;
        else return message.channel.send(command.returnMsg);
        
    };

    //Staff Control
    if (command.staff && message.channel.type == 'text' && !Owners.includes(message.author.id) && !message.member.hasPermission('MANAGE_ROLES') && !message.member.roles.cache.has(botYt) && !staffRoles.some(role => message.member.roles.cache.has(role))) {

        if (!command.returnMsg) return;
        else return message.channel.send(command.returnMsg);

    };

    //Guild Control
    if (command.guildOnly && message.channel.type == "dm") {

        if (!command.returnMsg) return;
        else return message.channel.send(command.returnMsg);

    };

//Operations

    //Cooldowns
    if (!client.cooldowns.has(command.name)) {
      
        client.cooldowns.set(command.name, new Collection());
        
    };
  
    const timestamps = client.cooldowns.get(command.name);
    const now = Date.now();
    const cooldownAmount = (command.cooldown) * 1000;
  
    if (timestamps.has(message.author.id)) {
        
        const expirationtime = timestamps.get(message.author.id) + cooldownAmount;
      
        if(DisableCooldownsForAdmins) {
        
            if (expirationtime > now && !Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) {
            
                const timeleft = (expirationtime - now) / 1000;
                parseInt(timeleft)
                message.channel.error(message, `Bu komutu tekrar kullana bilmek için lütfen **${parseInt(timeleft) == 0 ? 1 : parseInt(timeleft)} saniye** bekleyin`, { timeout: 5000, reply: true, react: true });

            };
        
        } else {
        
            if (expirationtime > now) {
            
                const timeleft = (expirationtime - now) / 1000;
                parseInt(timeleft)
                message.channel.error(message, `Bu komutu tekrar kullana bilmek için lütfen **${parseInt(timeleft) == 0 ? 1 : parseInt(timeleft)} saniye** bekleyin`, { timeout: 5000, reply: true, react: true });

            };
        };
        
    };
  
    timestamps.set(message.author.id, now);
    setTimeout(() => {
        
        timestamps.delete(message.author.id);
        
    }, cooldownAmount);

    //Running Commands
    try {
        
        command.execute(client, message, args, Embed);
        
    }
    catch (e) {
        
        message.channel.error(message, `Bu komut çalıştırılırken bir hata oluştu. Lütfen durumla ilgili botun yapımcılarına haber verin ve biraz sonra tekrar deneyin`, { react: true });
        Owners.filter(owner => owner !== '').forEach((owner, index) => {

            client.wait(index * 1200);
            client.users.cache.get(owner).send(`
**${message.channel.toString()}** adlı kanalda \`${command.name}\` adlı komut kullanılırken hata oluştu !
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