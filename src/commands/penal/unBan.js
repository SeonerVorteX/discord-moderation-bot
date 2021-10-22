const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, dmMessages, penals } = global.client.guildSettings;
const { staffs, log, unbanGifs } = penals.ban;
const Penals = require('../../schemas/penals.js');
const forceBans = require('../../schemas/forceBans.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'unban',
    aliases: [],
    category: 'Ceza',
    usage: '<ID>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.hasPermission('BAN_MEMBERS') && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };
        
        if(!args[0]) return message.channel.error(message, `Bir kullanıcı ID'si belirtmelisin!`, { timeout: 8000, reply: true, react: true });

        let bannedUser = await client.fetchBan(message.guild, args[0]);
        
        if(!bannedUser) return message.channel.error(message, `Bu üye sunucudan yasaklı değil yada geçerli bir üye belirtilmedi!`, { timeout: 8000, react: true });

        let forceban = await Penals.findOne({ guildID: message.guild.id, userID: bannedUser.user.id, type: "FORCE-BAN", active: true });
        let forceBan = await forceBans.findOne({ guildID: message.guild.id, userID: bannedUser.user.id });

        if(forceban || forceBan) return message.channel.error(message, `Bu üye sunucudan kalıcı olarak yasaklanmış, bu yüzden yasağı kaldırılamaz!`, { timeout: 8000, react: true });

        message.guild.members.unban(bannedUser.user.id, `${message.author.tag} tarafından yasağın kaldırılması istendi!`).catch(() => {});

        let reason = args.slice(1).join(' ');
        let penal = await Penals.findOne({ guildID: message.guild.id, userID: bannedUser.user.id, type: "BAN", active: true });

        if(penal) {

            penal.active = false;
            penal.finishDate = Date.now();
            await penal.save();

        };

        message.channel.success(message, Embed.setDescription(`\`${bannedUser.user.tag}\` kullanıcısının yasağı, ${message.author.toString()} tarafından kaldırıldı! \`(Ceza ID : ${!penal ? `Veri Bulunamadı` : `#${penal.id}`})\``), { react: true });

        if(log) client.channels.cache.get(log).send(Embed.setColor('#00FF00').setFooter('').setImage(unbanGifs.random()).setDescription(`
\`${bannedUser.user.username}\` kullanıcısının **yasağı** kaldırıldı!

**Ceza ID :** \`${!penal ? `Veri Bulunamadı!` : `#${penal.id}`}\`
**Yasağı Kaldırılan Kullanıcı :** \`${bannedUser.user.tag} (${bannedUser.user.id})\`
**Yasağı Kaldıran Yetkili :** \`${message.author.tag} (${message.author.id})\`
**Yasaklanma Tarihi :** \`${!penal ? `Veri Bulunamadı!` : moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasağın Kaldırılma Tarihi :** \`${moment(Date.now()).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasağın Kaldırılma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
        `));

        if(dmMessages) bannedUser.user.send(`\`${message.guild.name}\` sunucusundaki yasağınız, **${message.author.tag}** tarafından kaldırıldı! ${!penal ? `` : `\`(Ceza ID : #${penal.id})\``}`).catch(() => {});

    },
};