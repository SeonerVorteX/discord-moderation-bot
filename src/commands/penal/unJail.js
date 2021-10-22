const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals } = global.client.guildSettings;
const { staffs, jailRoles, log } = penals.jail;
const { unregisterRoles } = global.client.guildSettings.registration;
const { jailed } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'unjail',
    aliases: [],
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
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!jailRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, `Belirttiğin üye daha önce jaillenmemiş!`, { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın`, { timeout: 8000, reply: true, react: true });
        if(!user.manageable) return message.channel.error(message, `Belirtilen üyeye bu işlemi uygulayamıyorum!`, { timeout: 8000, react: true });
        
        user.roles.set(unregisterRoles).catch(() => {});
        let penal = await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'JAIL', active: true }) || await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'TEMP-JAIL', active: true });

        if(penal) {

            penal.finishDate = Date.now();
            penal.active = false;
            penal.save();

        };

        message.channel.success(message, Embed.setDescription(`${jailed ? jailed : ``} \`${user.user.tag}\` isimli kullanıcının jaili ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} kaldırıldı! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#0000FF').setDescription(`
${user.toString()} kullanıcısının  **jaili** kaldırıldı!

**Ceza ID :** \`#${penal.id}\`
**Jaili Kaldırılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Jaili Kaldıran Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Jaillenme Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Jaillenme Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
**Jailin Kaldırılma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${jailed ? jailed : ``} \`${message.guild.name}\` sunucusunda, **${message.author.tag}** tarafından, jailiniz kaldılırdı! \`(Ceza ID : #${penal.id})\``).catch(() => {});

    },
};