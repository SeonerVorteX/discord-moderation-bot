const { dmMessages, penals, logs } = global.client.guildSettings;
const { penalPoint, log, banGifs } = penals.ban;
const { pointLog } = logs;
const { banned } = require('../../configs/emojis.json');
const forceBans = require('../../schemas/forceBans');
const penalPoints = require('../../schemas/penalPoints.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'forceban',
    aliases: [],
    category: 'Ceza',
    usage: '<@Üye/ID> <Sebep>',
    guildOwner: true,
    guildOnly: true,
    cooldown: 3,

    /**
     * 
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(await client.fetchBan(message.guild, args[0])) return message.channel.error(message, `Belirttiğin üye sunucudan daha önce yasaklanmış!`, { timeout: 8000, react: true })
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!user.bannable) return message.channel.error(message, `Belirtilen üyeyi yasaklayamıyorum!`, { timeout: 8000, react: true });
        
        message.guild.members.ban(user.id, { reason: `${!reason ? `${message.author.tag} tarafından bilinmeyen bir nedenle kalıcı olarak yasaklanması istendi!` : `${message.author.tag} tarafından ${reason} sebebiyle kalıcı olarak yasaklanması istendi!`}` }).catch(() => {});
        let point = await client.addPenalPoint(message.guild.id, user.id, penalPoint);
        let penal = await client.newPenal(message.guild.id, user.id, "FORCE-BAN", true, message.author.id, !reason ? 'Belirtilmedi!' : reason);
        await new forceBans({ guildID: message.guild.id, userID: user.id, staffID: message.author.id }).save();
        
        message.channel.success(message, Embed.setDescription(`${banned ? banned : ``} \`${user.user.tag}\` isimli kullanıcı, ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} sunucudan **kalıcı olarak** yasaklandı! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#FF0000').setFooter('').setImage(banGifs.random()).setDescription(`
${user.toString()} kullanıcısı **kalıcı olarak yasaklandı!**

**Ceza ID :** \`#${penal.id}\`
**Yasaklanan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Yasaklayan Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Yasaklanma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasaklanma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${banned ? banned : ``} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} **kalıcı olarak** yasaklandınız! \`(Ceza ID : #${penal.id})\``).catch(() => {});
        if(pointLog) client.channels.cache.get(pointLog).send(`${banned ? banned : ``} ${user.toString()}, aldığınız \`#${penal.id}\` ID'li **ForceBan** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

    },
};