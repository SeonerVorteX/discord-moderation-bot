module.exports = {
    name: 'kilit',
    aliases: ['lock'],
    category: 'Admin',
    usage: '<#Kanal/ID>',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * 
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed
     */

    execute(client, message, args, Embed) {

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        let reason = args.slice(1).join(' ');


        if(channel) {

            if(channel.type !== 'text') return message.channel.error(message, Embed.setDescription(`Belirttiğin kanal bir metin kanalı değil`), { timeout: 8000, react: true });
            if(!channel.manageable) return message.channel.error(message, Embed.setDescription(`Bu işlem için yeterli yetkiye sahip değilim`), { timeout: 8000, react: true });
            if(channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {

                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                });

                message.channel.success(message, Embed.setDescription(`${channel.toString()} kanalı ${message.author.toString()} tarafından ${!reason ? '' : `\`${reason}\` sebebiyle`} kilitlendi!`), { react: true });

            } else {

                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: true,
                });

                message.channel.success(message, Embed.setDescription(`${channel.toString()} kanalının kilidi ${message.author.toString()} tarafından ${!reason ? '' : `\`${reason}\` sebebiyle`} açıldı!`), { react: true });

            };

        } else {

            if(!message.channel.manageable) return message.channel.error(message, Embed.setDescription(`Bu işlem için yeterli yetkiye sahip değilim`), { timeout: 8000, react: true });
            if(message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
               
                message.channel.success(message, Embed.setDescription(`${message.channel.toString()} kanalı ${message.author.toString()} tarafından ${!reason ? '' : `\`${reason}\` sebebiyle`} kilitlendi!`), { react: true });

                message.channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false,
                });

            } else {

                message.channel.success(message, Embed.setDescription(`${message.channel.toString()} kanalının kilidi ${message.author.toString()} tarafından ${!reason ? '' : `\`${reason}\` sebebiyle`} açıldı!`), { react: true });

                message.channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: true,
                });

            };

        };

    },
};