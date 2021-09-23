module.exports = {
    name: 'sunucuicon',
    aliases: ['servericon'],
    category: 'Kullanıcı',
    usage: '',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    execute(client, message, args, Embed) {

        message.channel.success(message, Embed.setFooter(``).setImage(message.guild.iconURL({ dynamic: true, size: 256 })), { react: true });

    },
};