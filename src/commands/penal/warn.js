const { Owners, Prefix } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals, logs } = global.client.guildSettings;
const { staffs, warnRoles, penalPoint, log } = penals.warn;
const { warned } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'warn',
    aliases: ['uyar'],
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

        if(!Owners.includes(message.author.id) && !message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(warnRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, `Belirttiğin üye daha önce uyarılmış! Bilgi için : \`${Prefix}warnbilgi <ID>\``, { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!user.manageable) return message.channel.error(message, `Belirtilen üyeyi uyaramıyorum!`, { timeout: 8000, react: true });

        let point = await client.addPenalPoint(message.guild.id, user.id, penalPoint);
        let penal = await client.newPenal(message.guild.id, user.id, "WARN", false, message.author.id, !reason ? 'Belirtilmedi!' : reason);
        let datas = await Penals.find({ guildID: message.guild.id, userID: user.id, type: "WARN" });

        if(datas.length > 0 && warnRoles.some(role => role.warnCount == datas.length)) user.roles.add(warnRoles.find(role => role.warnCount == datas.length).warnRole);

        message.channel.success(message, Embed.setDescription(`${warned} \`${user.user.tag}\` isimli kullanıcı, ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} uyarıldı! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setDescription(`
${user.toString()} kullanıcısı **uyarıldı!**

**Ceza ID :** \`#${penal.id}\`
**Uyarılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Uyaran Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Uyarılma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Uyarılma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${warned} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} uyarıldınız! \`(Ceza ID : #${penal.id})\``).catch(() => {});
        if(logs.pointLog) client.channels.cache.get(logs.pointLog).send(`${warned} ${user.toString()}, aldığınız \`#${penal.id}\` ID'li **Warn** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

    },
};