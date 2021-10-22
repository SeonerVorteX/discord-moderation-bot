const { Prefix } = global.client.settings;
const { messageLog } = global.client.guildSettings.logs;
const embed = require('../utils/Embed.js');

/**
 * @param { Message } oldMessage 
 * @param { Message } newMessage 
 */

module.exports = async (oldMessage, newMessage) => {

    if(newMessage.author.bot) return;
    if(oldMessage.content == newMessage.content) return;
    if(newMessage.content.toLowerCase().startsWith(`${Prefix}eval`) || oldMessage.content.toLowerCase().startsWith(`${Prefix}sil`) || newMessage.content.toLowerCase().startsWith(`${Prefix}sil`)) return;

    let Embed = embed('Mesaj Düzenlendi', newMessage.guild.iconURL({ dynamic: true }), false);
    let channel = newMessage.guild.channels.cache.get(messageLog);

    if(messageLog && channel && channel.type == 'text') channel.send(
        Embed
        .addFields(
            { name: `Mesaj Sahibi`, value: newMessage.author.toString(), inline: true },
            { name: `Kanal`, value: newMessage.channel.toString(), inline: true },
            { name: `Mesaj ID`, value: `\`${newMessage.id}\``, inline: true },
            { name: `Eski Mesaj`, value: `${oldMessage.content ? `\`${oldMessage.content}\`` : `*Sadece Resim*`}`, inline: true },
            { name: `Yeni Mesaj`, value: `${newMessage.content ? `\`${newMessage.content}\`` : `*Sadece Resim*`}`, inline: true },
        )
        .setThumbnail(newMessage.author.avatarURL({ dynamic: true }))
        .setImage(newMessage.attachments.first() ? newMessage.attachments.first().proxyURL : ``)
        .setColor('YELLOW')
    );

};

module.exports.conf = {
    name: 'Message Update',
    event: 'messageUpdate',
};