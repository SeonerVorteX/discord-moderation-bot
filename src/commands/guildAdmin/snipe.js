const snipe = require('../../schemas/snipe.js');

module.exports = {
    name: 'snipe',
    aliases: [],
    category: 'Admin',
    usage: '<#Kanal/ID>',
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

        let data = await snipe.findOne({ guildID: message.guild.id, channelID: message.channel.id });
        if(!data) return message.channel.success(message, Embed.setDescription(`Bu kanalda silinmiş herhangi bir mesaj bulunmuyor!`), { react: true });

        message.channel.success(message, Embed.setDescription(`
${data.messageContent ? `\`Mesaj İçeriği :\` **${data.messageContent}**` : ``}
\`Mesaj Sahibi :\` ${await client.fetchUser(data.userID).then(user => user.toString())} ${data.authorID ? `\n\`Silen Kişi :\` ${await client.fetchUser(data.authorID).then(user => user.toString())}` : ``}
\`Mesajın Yazıldığı Tarih :\` ${await client.duration(Date.now() - data.createdDate)} önce
\`Mesajın Silindiği Tarih :\` ${await client.duration(Date.now() - data.deletedDate)} önce
        `).setImage(data.image ? data.image : ``), { timeout: 15000, react: true });

    },
};