const { MessageEmbed } = require('discord.js');
const moment = require("moment");
const afk = require('../schemas/afk.js');
const embed = require('../utils/Embed.js');
require("moment-duration-format");

/**
 * @param { Message } message 
 */

module.exports = async (message) => {

    if(message.author.bot || !message.guild) return;

    let Embed = embed(message.author.username, message.author.avatarURL({ dynamic: true }), false);
    let afkData = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });

    if(afkData) {

        if(message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
        message.channel.success(message, Embed.setDescription(`${message.member.toString()}, Başarıyla AFK modundan çıktın. Toplam **${moment.duration(Date.now() - afkData.date).format("d [gün,] H [saat,] m [dakika,] s [saniyedir]")}** AFK'dın`), { timeout: 6000 });
        await afk.deleteOne({ guildID: message.guild.id, userID: message.author.id });
    
    };

    let member = message.mentions.members.forEach(async member => {

        let memberData = await afk.findOne({ guildID: message.guild.id, userID: member.id });
        if(memberData) {

            message.channel.send(Embed.setDescription(`${member.toString()} kullanıcısı ${memberData.reason == 'Belirtilmedi' ? '' : `\`${memberData.reason}\` nedeniyle,`} **${moment.duration(Date.now() - memberData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** önce afk oldu!`));

        };

    });

};

module.exports.conf = {
    name: 'AFK',
    event: 'message'
};