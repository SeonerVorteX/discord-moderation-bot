const { Owners, Prefix } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals, logs } = global.client.guildSettings;
const { staffs, cmuteRoles, penalPoint, penalLimit, log } = penals.chatMute;
const { chatMuted, unCMuted } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const ms = require('ms')
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'mute',
    aliases: [],
    category: 'Ceza',
    usage: '<@Üye/ID> <Süre> <Sebep>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { Embed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let duration = args[1];
        let reason = args.slice(2).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!cmuteRoles || !cmuteRoles.length) return message.channel.error(message, `Chat-Mute rolleri ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`, { timeout: 15000, react: true });
        if(cmuteRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, `Belirttiğin üye **metin kanallarında** daha önce susturulmuş! Bilgi için : \`${Prefix}mutebilgi <@Üye/ID>\``, { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!user.manageable) return message.channel.error(message, `Belirtilen üyeyi susturamıyorum!`, { timeout: 8000, react: true });
        if(!duration) return message.channel.error(message, `Bir süre belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!['s', 'sn', 'saniye', 'm', 'minute', 'dk', 'dakika', 'h', 'hour', 'st', 'saat', 'd', 'day', 'g', 'gün'].some(arg => duration.includes(arg))) return message.channel.error(message, `Sadece \`saniye(s, sn)\` , \`dakika(dk, m, minute)\` , \`saat(st, h, hour)\` , \`gün(g, d, day)\` cinsinden bir süre belirtmelisin! Örnek : \`${Prefix}mute @Üye/ID 15dk küfür\``, { timeout: 15000, reply: true, react: true });
        if(isNaN(client.replaceDuration(duration)) || client.replaceDuration(duration) == 0 || client.replaceDuration(duration).includes('-')) return message.channel.error(message, `Geçerli bir süre miktarı belirtmelisin`, { timeout: 8000, reply: true, react: true });
        
        let staffDatas = await Penals.find({ guildID: message.guild.id, type: 'CHAT-MUTE', staffID: message.author.id });
        let dataSize = staffDatas.filter(staffData => staffData.date && (Date.now() - staffData.date) < 3600 * 1000);

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && message.member.roles.cache.has(botYt) &&  penalLimit > 0 && dataSize.length >= penalLimit) return message.channel.error(message, `Saatlik mute sınırına ulaştın!`, { timeout: 8000, react: true });

        duration = await client.ms(duration);
        user.roles.add(cmuteRoles);
        let point = await client.addPenalPoint(message.guild.id, user.id, penalPoint);
        let penal = await client.newPenal(message.guild.id, user.id, "CHAT-MUTE", true, message.author.id, !reason ? 'Belirtilmedi!' : reason, true, Date.now(), Date.now() + ms(duration.duration));

        message.channel.success(message, Embed.setDescription(`${chatMuted ? chatMuted : ``} \`${user.user.tag}\` isimli kullanıcı, ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle,`} **${duration.durationMsg}** boyunca susturuldu! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#FF0000').setDescription(`
${user.toString()} kullanıcısı **metin kanallarında** \`${duration.durationMsg}\` boyunca **susturuldu!**

**Ceza ID :** \`#${penal.id}\`
**Susturulan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Susturan Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Susturulma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulmanın Bitiş Tarihi :** \`${moment(penal.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${chatMuted ? chatMuted : ``} \`${message.guild.name}\` sunucusunda **${message.author.tag}** tarafından **metin kanallarında** ${!reason ? '' : `\`${reason}\` sebebiyle,`} **${duration.durationMsg}** boyunca susturuldunuz! \`(Ceza ID : #${penal.id})\``).catch(() => {});
        if(logs.pointLog) client.channels.cache.get(logs.pointLog).send(`${chatMuted ? chatMuted : ``} ${user.toString()}, aldığınız \`#${penal.id}\` ID'li **ChatMute** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

        setTimeout(async () => {

            if(message.guild.members.cache.has(user.id) && cmuteRoles.some(role => user.roles.cache.has(role)) && user.manageable) user.roles.remove(cmuteRoles);

            penal = await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'CHAT-MUTE', active: true });

            if(!penal) return;

            penal.active = false;
            await penal.save();

            if(log) client.channels.cache.get(log).send(Embed.setColor('#00FF00').setDescription(`
${user.toString()} kullanıcısının **metin kanallarında** olan susturulmasının süresi bitti!

**Ceza ID :** \`#${penal.id}\`
**Susturulan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Susturan Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Susturulma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulmanın Bitiş Tarihi :** \`${moment(penal.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
            `));

            if(dmMessages) user.send(`${unCMuted ? unCMuted : `:speech_balloon:`} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} **metin kanallarında** aldığınız susturulma cezasının süresi bitti! \`(Ceza ID : #${penal.id})\``).catch(() => {});

        }, ms(duration.duration));

    },
};