const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals } = global.client.guildSettings;
const { staffs, vmuteRoles, log } = penals.voiceMute;
const { unMuted } = require('../../configs/emojis.json');
const Penals = require('../../schemas/penals.js');
const ms = require('ms')
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'vunmute',
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

        if(!Owners.includes(message.author.id) && !message.member.hasPermission('MUTE_MEMBERS') && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
        if(!vmuteRoles.some(role => user.roles.cache.has(role))) return message.channel.error(message, `Belirttiğin üye **ses kanallarında** daha önce susturulmamış!`, { timeout: 8000, react: true });
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın`, { timeout: 8000, reply: true, react: true });
        if(!user.manageable) return message.channel.error(message, `Belirtilen üyeye bu işlemi uygulayamıyorum!`, { timeout: 8000, react: true });
        
        user.roles.remove(vmuteRoles).catch(() => {});
        if(user.voice.channel && user.voice.serverMute) user.voice.setMute(false);
        let penal = await Penals.findOne({ guildID: message.guild.id, userID: user.id, type: 'VOICE-MUTE', active: true });

        if(penal) {

            penal.finishDate = Date.now();
            penal.active = false;
            penal.removed = true;
            penal.save();

        };

        message.channel.success(message, Embed.setDescription(`${unMuted ? unMuted : ``} \`${user.user.tag}\` isimli kullanıcının **ses kanallarındaki** susturulma cezası ${message.author.toString()} tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} kaldırıldı! \`(Ceza ID : #${penal.id})\``), { react: true });
        if(log) client.channels.cache.get(log).send(Embed.setColor('#0000FF').setDescription(`
${user.toString()} kullanıcısının  **ses kanallarındaki** susturulma cezası kaldırıldı!

**Ceza ID :** \`#${penal.id}\`
**Cezası Kaldırılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Cezayı Kaldıran Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Susturulma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!penal.reason ? 'Belirtilmedi!' : penal.reason}\`
**Cezanın Kaldırılma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) user.send(`${unMuted ? unMuted : ``} \`${message.guild.name}\` adlı sunucuda **${message.author.tag}** tarafından **ses kanallarında** olan susturulma cezanız kaldılırdı! \`(Ceza ID : #${penal.id})\``).catch(() => {});

    },
};