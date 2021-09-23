const { messageLog } = global.client.guildSettings.logs;

module.exports = {
    name: 'sil',
    aliases: ['temizle'],
    category: 'Yetkili',
    usage: '<Mesaj Sayı> <Sebep>',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        let messageSize = args[0];
        let reason = args.slice(1).join(' ');

        if(!messageSize) return message.channel.error(message, Embed.setDescription(`Silinicek mesaj sayısını belirtmelisin!`), { timeout: 6000, react: true });
        if(isNaN(messageSize) || messageSize == 0 || messageSize.includes('-')) return message.channel.error(message, Embed.setDescription(`Geçerli bir sayı belirtmelisin!`), { timeout: 6000, react: true });
        if(messageSize > 100) return message.channel.error(message, Embed.setDescription(`1 ve 100 arasında bir rakam belirtmelisin!`), { timeout: 6000, react: true });

        await message.delete().catch(() => {});
        await message.channel.bulkDelete(messageSize).then(async messages => await message.channel.success(message, Embed.setDescription(`**${messageSize}** adet mesaj ${!reason ? '' : `\`${reason}\` nedeniyle`} başarıyla silindi!`), { timeout: 6000 })).catch(() => {});
        
        if(messageLog){

            let mLog = message.guild.channels.cache.get(messageLog);

            if(mLog && mLog.type == 'text') mLog.send(Embed.setDescription('').setAuthor(`Toplu Mesaj Silindi`, message.guild.iconURL({ dynamic: true })).setThumbnail(message.author.avatarURL({ dynamic: true })).addFields(
                { name: `Silinen Mesaj Sayı`, value: `**${messageSize}**`, inline: true },
                { name: `Silindiği Kanal`, value: message.channel.toString(), inline: true },
                { name: `Silen Yetkili`, value: message.author.toString(), inline: true },
                { name: `Silinme Sebebi`, value: reason ? `\`${reason}\`` : `\`Belirtilmedi!\``, inline: false },
            ));

        };

    },
};