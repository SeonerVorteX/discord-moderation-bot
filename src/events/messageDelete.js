const { Prefix, OtherBots } = global.client.settings;
const { messageLog } = global.client.guildSettings.logs;
const snipe = require('../schemas/snipe.js');
const embed = require('../utils/Embed.js');
const commands = require('../schemas/commands.js');

/**
 * @param { Message } message 
 */

module.exports = async (message) => {

    if(message.author.bot) return;

    let Commands = await commands.findOne({ guildID: message.guild.id });

    if(Commands && ((Commands.moderationCommands && Commands.moderationCommands.some(command => message.content.startsWith(command))) || (Commands.registerCommands && Commands.registerCommands.some(command => message.content.startsWith(command))))) return;

    let Embed = embed('Mesaj Silindi', message.guild.iconURL({ dynamic: true }), false);
    let data = await snipe.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, userID: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
    let channel = message.guild.channels.cache.get(messageLog);
    let audit = await message.guild.fetchAuditLogs();
    let entry = audit.entries.first();

    if(data && entry && entry.action == 'MESSAGE_DELETE' && entry.extra.channel.id == message.channel.id && entry.target.id == message.author.id && !OtherBots.includes(entry.executor.id) && entry.executor.id !== client.user.id) {

        data.authorID = entry.executor.id;
        data.save(); 
    
        if(messageLog && channel && channel.type == 'text') channel.send(
            Embed
            .addFields(
                { name: `Mesaj Sahibi`, value: message.author.toString(), inline: true },
                { name: `Silindiği Kanal`, value: message.channel.toString(), inline: true },
                { name: `Silen Yetkili`, value: entry.executor.toString(), inline: true },
                { name: `Silinen Mesaj`, value: `${message.content ? `\`${message.content}\`` : `*Mesaj Yok*`}`, inline: true },
                { name: `Mesaj ID`, value: `\`${message.id}\``, inline: true },
            )
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setImage(message.attachments.first() ? message.attachments.first().proxyURL : ``)
            .setColor('#FF0000')
        );

    } else {

        if(data) {
            data.authorID = undefined;
            data.save();
        };

        if(messageLog && channel && channel.type == 'text') channel.send(
            Embed
            .addFields(
                { name: `Mesaj Sahibi`, value: message.author.toString(), inline: true },
                { name: `Silindiği Kanal`, value: message.channel.toString(), inline: true },
                { name: `Mesaj ID`, value: `\`${message.id}\``, inline: true },
                { name: `Silinen Mesaj`, value: `${message.content ? `\`${message.content}\`` : `*Mesaj Yok*`}`, inline: false },
            )
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setImage(message.attachments.first() ? message.attachments.first().proxyURL : ``)
            .setColor('#FF0000')
        );

    };

};

module.exports.conf = {
    name: 'Message Delete',
    event: 'messageDelete',
};
