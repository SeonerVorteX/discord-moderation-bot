const { OtherBots } = global.client.settings;
const { guildID, dmMessages, penals, logs } = global.client.guildSettings;
const { log, penalPoint, banGifs } = penals.ban;
const { client } = global; 
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
    let audit = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
    let executor = audit.entries.first().executor;
    let reason = await client.fetchBan(guild, user.id).then(bannedUser => bannedUser.reason);

    if(executor.bot && (executor.id == client.user.id || OtherBots.includes(executor.id))) return;

    let point = await client.addPenalPoint(guild.id, user.id, penalPoint);
    let penal = await client.newPenal(guild.id, user.id, "BAN", true, executor.id, !reason ? 'Belirtilmedi!' : reason);

    guild.channels.cache.get(log).send(Embed.setFooter('').setImage(banGifs.random()).setDescription(`
${user.toString()} kullanıcısı ${executor.toString()} tarafından sağ tık ile **yasaklandı!**

**Ceza ID :** \`#${penal.id}\`
**Yasaklanan Kullanıcı :** \`${user.tag} (${user.id})\`
**Yasaklayan Yetkili :** \`${executor.tag} (${executor.id})\`
**Yasaklanma Tarihi :** \`${moment(penal.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Yasaklanma Sebebi :** \`${!reason ? 'Belirtilmedi!' : reason}\`
    `));

    if(dmMessages) user.send(`\`${guild.name}\` sunucusunda, **${executor.tag}** tarafından, ${!reason ? '' : `\`${reason}\` sebebiyle`} yasaklandınız! \`(Ceza ID : #${penal.id})\``).catch(() => {});
    if(logs.pointLog) client.channels.cache.get(logs.pointLog).send(`${user.toString()}, aldığınız \`#${penal.id}\` ID'li **Ban** cezası ile toplam **${point.penalPoint}** ceza puanına ulaştınız!`);

};

module.exports.conf = {
    name: 'Guild Ban Add',
    event: 'guildBanAdd'
};