const afk = require('../../schemas/afk.js');
const { Owners } = global.client.settings;
const { guildTags, botYt } = global.client.guildSettings;

module.exports = {
    name: 'afk',
    aliases: [],
    category: 'Kullanıcı',
    usage: '<Sebep>',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        if((!guildTags.length ? false : !message.member.hasPermission(8)) && !Owners.includes(message.author.id) && !message.member.roles.cache.has(botYt) && (!guildTags.length ? false : !guildTags.filter(tag => tag !== '').some(tag => message.member.user.username.includes(tag)))) return message.channel.error(message, `Bu özelliğği kullana bilmek için tag alman gerekiyor`, { timeout: 10000, reply: true, react: true, keepMessage: true });

        let reason = args.slice(0).join(' ') || 'Belirtilmedi';

        await afk.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason, date: Date.now() } }, { upsert: true });

        message.channel.success(message, Embed.setDescription(`Başarıyla AFK oldunuz. Sebep : \`${reason}\``), { timeout: 6000, react: true });

        if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);

    },
};