const { mark2, cross2, muted, chatMuted, jailed, banned, warned } = require('../../configs/emojis.json');
const penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'cezabilgi',
    aliases: ['cezasorgu'],
    category: 'Bilgi',
    usage: '<#Ceza ID>',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir ceza ID'si belirtmelisin!`), { timeout: 8000, react: true });

        let id = args[0].replace('#', '');

        if(isNaN(id) || id.includes('-')) return message.channel.error(message, Embed.setDescription(`Geçerli bir ceza ID'si belirtmelisin!`), { timeout: 8000, react: true });

        let penal = await penals.findOne({ id: id, guildID: message.guild.id });

        if(!penal) return message.channel.error(message, Embed.setDescription(`Veritabanında \`#${id}\` ID'li bir ceza bulunamadı!`), { timeout: 8000, react: true });

        let user = await client.fetchUser(penal.userID);
        let staff = await client.fetchUser(penal.staffID);
        message.channel.success(message, Embed.setDescription(`\`#${id}\` ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** ${user.toString()} üyesi \`${staff.tag} (${staff.id})\` tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almış! ${penal.finishDate ? `Cezanın bitiş tarihi : \`${moment(penal.finishDate).format("DD MMMM YYYY (HH:mm)")}\`` : ''}`), { react: true });

    },
};