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

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      
        if(!user.user.avatar) return message.channel.error(message, `${user.user.id == message.author.id ? 'Maalesef sizin bir avatarınız yok!' : 'Belirtilen kullanıcı bir avatara sahip değil!'}`, { react: true });

        message.channel.success(message, Embed.setFooter(``).setAuthor(user.user.username, client.user.avatarURL()).setImage(user.user.avatarURL({ dynamic: true, size: 256 })), { react: true });

    },
};