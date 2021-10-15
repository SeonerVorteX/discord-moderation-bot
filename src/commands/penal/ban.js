const { Owners, Prefix } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals, logs } = global.client.guildSettings;
const { staffs, penalPoint, penalLimit, log, banGifs } = penals.ban;
const { banned } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'ban',
    aliases: ['yasakla'],
    category: 'Ceza',
    usage: '<@Üye/ID> <Sebep>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {
        
        if(!Owners.includes(message.author.id) && !message.member.hasPermission('BAN_MEMBERS') && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let ban = await client.fetchBan(message.guild, args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(ban) return message.channel.error(message, `Belirttiğin üye sunucudan daha önce yasaklanmış! Bilgi için : \`${Prefix}banbilgi <ID>\``, { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!user.bannable) return message.channel.error(message, `Belirtilen üyeyi yasaklayamıyorum!`, { timeout: 8000, react: true });

        let staffDatas = await Penals.find({ guildID: message.guild.id, type: 'BAN', staffID: message.author.id });
        let dataSize = staffDatas.filter(staffData => staffData.date && (Date.now() - staffData.date) < 3600 * 1000);

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && message.member.roles.cache.has(botYt) && penalLimit > 0 && dataSize.length >= penalLimit) return message.channel.error(message, `Saatlik ban sınırına ulaştın!`, { timeout: 8000, react: true });
        
        message.guild.members.ban(user.id, { reason: `${!reason ? `${message.author.tag} tarafından bilinmeyen bir nedenle yasaklanması istendi!` : `${message.author.tag} tarafından ${reason} sebebiyle yasaklanması istendi!`}` }).catch(() => {});
        let point = await client.addPenalPoint(message.guild.id, user.id, penalPoint);
        let penal = await client.newPenal(message.guild.id, user.id, "BAN", true, message.author.id, !reason ? 'Belirtilmedi!' : reason);

        message.channel.success(message, Embed.setDescription(`${banned ? banned : ``} \`${user.user.tag}\` isimli kullanıcı, ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} sunucudan yasaklandı! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#FF0000').setFooter('').setImage(banGifs.random()).setDescription(`
${user.toString()} kullanıcısı **yasaklandı!**

**Ceza ID :** \`#${penal.id}\`
**Yasaklanan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Yasaklayan Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Yasaklanma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasaklanma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${banned ? banned : ``} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} yasaklandınız! \`(Ceza ID : #${penal.id})\``).catch(() => {});
        if(logs.pointLog) client.channels.cache.get(logs.pointLog).send(`${banned ? banned : ``} ${user.toString()}, aldığınız \`#${penal.id}\` ID'li **Ban** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

    },
};