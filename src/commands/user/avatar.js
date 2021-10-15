module.exports = {
    name: 'avatar',
    aliases: ['pp'],
    category: 'Kullanıcı',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    execute(client, message, args, Embed) {

        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;

        message.channel.success(message, Embed.setFooter(``).setAuthor(user.username, client.user.avatarURL()).setImage(user.avatarURL({ dynamic: true, size: 256 })), { react: true });

    },
};