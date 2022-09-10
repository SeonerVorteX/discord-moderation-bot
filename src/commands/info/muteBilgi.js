const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, penals } = global.client.guildSettings;
const { staffs, cmuteRoles } = penals.chatMute;
const { vmuteRoles } = penals.voiceMute;
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'mutebilgi',
    aliases: ['mute-bilgi', 'vmutebilgi', 'vmute-bilgi'],
    category: 'Bilgi',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Nessage } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */
    
    async execute(client, message, args, Embed) {

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, Embed.setDescription(`Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`), { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.mentions.users.first() || message.guild.members.cache.get(args[0]) || client.users.cache.get(args[0]) || await client.fetchUser(args[0]).then(user => user);

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin`), { timeout: 8000, react: true });
        if((message.mentions.members.first() || message.guild.members.cache.get(args[0])) && !cmuteRoles.some(role => user.roles.cache.has(role)) && !vmuteRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye daha önce susturulmamış`), { timeout: 8000, repyl: true, react: true });

        let penal = await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'CHAT-MUTE', active: true }) || await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'VOICE-MUTE', active: true }); 

        if(!penal) return message.channel.error(message, Embed.setDescription(`Veritabanında belirtilen üyeye ait bir bilgi bulunamadı`), { timeout: 8000, react: true });

        if(penal.type == 'CHAT-MUTE') {

            message.channel.success(message, Embed.setDescription(`
${user.toString()} kullanıcısının **metin kanallarındaki** susturulma bilgisi :

**Ceza ID :** \`#${penal.id}\`
**Susturulan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Susturan Yetkili :** \`${client.users.cache.get(penal.staffID).tag} (${client.users.cache.get(penal.staffID).id})\`
**Susturulma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\` 
**Susturulmanın Bitiş Tarihi** \`${moment(penal.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
        `), { react: true });

        } else if(penal.type == 'VOICE-MUTE') {

            message.channel.success(message, Embed.setDescription(`
${user.toString()} kullanıcısının **ses kanallarındaki** susturulma bilgisi :
            
**Ceza ID :** \`#${penal.id}\`
**Susturulan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Susturan Yetkili :** \`${client.users.cache.get(penal.staffID).tag} (${client.users.cache.get(penal.staffID).id})\`
**Susturulma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\` 
**Susturulmanın Bitiş Tarihi** \`${moment(penal.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
            `), { react: true });

        };

    },
};
