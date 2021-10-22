const { OtherBots } = global.client.settings;
const { guildID, penals } = global.client.guildSettings;
const { log, unbanGifs } = penals.ban;
const { client } = global;
const forceBans = require('../schemas/forceBans.js');
const Penals = require('../schemas/penals.js');
const embed = require('../utils/Embed.js');
const moment = require('moment');
require("moment-duration-format");
moment.locale("tr");

/**
 * @param { Guild } guild 
 * @param { User } user
 */

module.exports = async (guild, user) => {

    if(guildID && guild.id !== guildID) return;

    let Embed = embed(user.username, user.avatarURL({ dynamic: true }), false);
    let audit = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' });
    let executor = audit.entries.first().executor;
    let forceban = await forceBans.findOne({ guildID: guild.id, userID: user.id });
    let penal = await Penals.findOne({ guildID: guild.id, userID: user.id, type: 'FORCE-BAN', active: true });
    
    if(forceban) {

        guild.members.ban(user.id, { reason: 'Kalıcı yasağı kaldırıldığı için tekrar yasaklandı!' }).catch(() => {});
        return guild.channels.cache.get(log).send(Embed.setDescription(`
\`${user.tag} (${user.id})\`  kullanıcısının **kalıcı yasağı** ${executor.toString()} tarafından kaldırıldığı için kullanıcı tekrar yasaklandı!

**Ceza ID :** \`${!penal ? `Veri Bulunamadı!` : `#${penal.id}`}\`
**Yasağı Kaldıran Yetkili :** \`${executor.tag} (${executor.id})\`
**Yasaklanma Tarihi :** \`${!penal ? `Veri Bulunamadı!` : moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasaklanma Sebebi :** \`${!penal ? `Veri Bulunamadı!` : penal.reason}\`
        `));

    } else {

        if(executor.bot && (executor.id == client.user.id || OtherBots.includes(executor.id))) return;

        penal = await Penals.findOne({ guildID: guild.id, userID: user.id, type: 'BAN', active: true });

        if(penal) {

            penal.finishDate = Date.now();
            penal.active = false;
            await penal.save();

        };


        guild.channels.cache.get(log).send(Embed.setFooter('').setImage(unbanGifs.random()).setDescription(`
\`${user.username}\` kullanıcısının **yasağı** ${executor.toString()} tarafından sağ tık ile kaldırıldı!

**Ceza ID :** \`${!penal ? `Veri Bulunamadı!` : `#${penal.id}`}\`
**Yasağı Kaldırılan Kullanıcı :** \`${user.tag} (${user.id})\`
**Yasağı Kaldıran Yetkili :** \`${executor.tag} (${executor.id})\`
**Yasaklanma Tarihi :** \`${!penal ? `Veri Bulunamadı!` : moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasağın Kaldırılma Tarihi :** \`${moment(Date.now()).format(`DD MMMM YYYY (HH:mm)`)}\`
        `));

    };

};

module.exports.conf = {
    name: 'Guild Ban Remove',
    event: 'guildBanRemove'
};