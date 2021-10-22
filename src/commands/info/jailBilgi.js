const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, penals } = global.client.guildSettings;
const { staffs, jailRoles } = penals.jail;
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'jailbilgi',
    aliases: ['jail-bilgi', 'karantinabilgi', 'karantina-bilgi'],
    category: 'Bilgi',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
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
        if((message.mentions.members.first() || message.guild.members.cache.get(args[0])) && !jailRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye daha önce jaillenmemiş!`), { timeout: 8000, repyl: true, react: true });

        let penal = await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'JAIL', active: true }) || await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'TEMP-JAIL', active: true }); 

        if(!penal) return message.channel.error(message, Embed.setDescription(`Veritabanında belirtilen üyeye ait bir bilgi bulunamadı`), { timeout: 8000, react: true });

        message.channel.success(message, Embed.setDescription(`
${user.toString()} kullanıcısının **${penal.type == 'TEMP-JAIL' ? `tempjail` : `jail`}** bilgisi :

**Ceza ID :** \`#${penal.id}\`
**Jaillenen Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Jailleyen Yetkili :** \`${client.users.cache.get(penal.staffID).tag} (${client.users.cache.get(penal.staffID).id})\`
**Jaillenme Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\` ${penals.type == 'TEMP-JAIL' ? `\n**Jailin Bitiş Tarihi** \`${moment(penal.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`` : ``} 
**Jaillenme Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
        `), { react: true });

    },
};