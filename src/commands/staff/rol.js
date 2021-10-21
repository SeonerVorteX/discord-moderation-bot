const { Prefix } = global.client.settings;
const { mark, succes } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'rol',
    aliases: ['role'],
    category: 'Yetkili',
    usage: '[ver / al]  <@Üye/ID> <@Rol/ID>',
    permission: 'MANAGE_ROLES',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}rol [ver / al]  <@Üye/ID> <@Rol/ID>\``), { timeout: 8000, react: true });

        if(['ver'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name == args[2]);

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Bir rol belirtmelisin!`));
            if(!role) return message.channel.error(message, Embed.setDescription(`Geçerli bir rol belirtmelisin!`), { timeout: 8000, react: true });
            if(role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(role.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol sahip olduğun en yüksek veya daha yüksek bir yetkide olduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
            if(user.roles.cache.has(role.id)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten belirttiğin role sahip!`), { timeout: 8000, react: true });

            await user.roles.add(role.id);
            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role.id, date: Date.now(), type: 'ROLE-ADD' }).save();

            return message.channel.true(message, Embed.setDescription(`${succes} ${user.toString()} adlı üyeye başarıyla ${role.toString()} rolü verildi!`), { react: true });

        } else if(['al'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name == args[2]);

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Bir rol belirtmelisin!`));
            if(!role) return message.channel.error(message, Embed.setDescription(`Geçerli bir rol belirtmelisin!`), { timeout: 8000, react: true });
            if(role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(role.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol sahip olduğun en yüksek veya daha yüksek bir yetkide olduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
            if(!user.roles.cache.has(role.id)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten belirttiğin role sahip değil!`), { timeout: 8000, react: true });

            await user.roles.remove(role.id);
            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role.id, date: Date.now(), type: 'ROLE-REMOVE' }).save();

            return message.channel.true(message, Embed.setDescription(`${succes} ${user.toString()} adlı üyeden ${role.toString()} rolü başarıyla alındı!`), { react: true });

        } return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}rol [ver / al]  <@Üye/ID> <@Rol/ID>\``), { timeout: 8000, react: true });

    },
};