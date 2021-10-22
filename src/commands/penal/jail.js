const { Owners, Prefix } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals, logs } = global.client.guildSettings;
const { staffs, jailRoles, penalPoint, penalLimit, log } = penals.jail;
const { jailed } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'jail',
    aliases: ['cezalı'],
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

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!jailRoles || !jailRoles.length) return message.channel.error(message, `Jail rolleri ayarlanmamış, lütfen botun yapımcısıyla iletişime geçin!`, { timeout: 15000, react: true });
        if(jailRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, `Belirttiğin üye daha önce jaillenmiş! Bilgi için : \`${Prefix}jailbilgi <@Üye/ID>\``, { timeout: 8000, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!user.manageable) return message.channel.error(message, `Belirtilen üyeyi jailleyemiyorum!`, { timeout: 8000, react: true });
        
        let staffDatas = await Penals.find({ guildID: message.guild.id, type: 'JAIL', ID: message.author.id });
        let staffDatas2 = await Penals.find({ guildID: message.guild.id, type: 'TEMP-JAIL', staffID: message.author.id });
        let dataSize = staffDatas.filter(staffData => staffData.date && (Date.now() - staffData.date) < 3600 * 1000);
        let dataSize2 = staffDatas2.filter(staffData => staffData.date && (Date.now() - staffData.date) < 3600 * 1000);
    
        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && message.member.roles.cache.has(botYt) && penalLimit > 0 && (dataSize.length + dataSize2.length) >= penalLimit) return message.channel.error(message, `Saatlik jail sınırına ulaştın!`, { timeout: 8000, react: true });
        
        user.roles.set(jailRoles).catch(() => {});
        if(user.voice.channel) user.voice.kick().catch(() => {});
        let point = await client.addPenalPoint(message.guild.id, user.id, penalPoint);
        let penal = await client.newPenal(message.guild.id, user.id, "JAIL", true, message.author.id, !reason ? 'Belirtilmedi!' : reason);

        message.channel.success(message, Embed.setDescription(`${jailed ? jailed : ``} \`${user.user.tag}\` isimli kullanıcı, ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} jaillendi! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#FF0000').setDescription(`
${user.toString()} kullanıcısı **jaillendi!**

**Ceza ID :** \`#${penal.id}\`
**Jaillenen Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Jailleyen Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Jaillenme Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Jaillenme Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${jailed ? jailed : ``} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} jaillendiniz! \`(Ceza ID : #${penal.id})\``).catch(() => {});
        if(logs.pointLog) client.channels.cache.get(logs.pointLog).send(`${jailed ? jailed : ``} ${user.toString()}, aldığınız \`#${penal.id}\` ID'li **Jail** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

    },
};