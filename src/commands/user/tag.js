const { guildTags, guildDiscriminator } = global.client.guildSettings;

module.exports = {
    name: 'tag',
    aliases: [],
    category: 'Kullanıcı',
    usage: '',
    guildOnly: true,

    /**
     * 
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args) {

        if(!guildTags.length && !guildDiscriminator) return message.channel.error(message, `Sunucu için herhangi bir tag ayarlanmamış`, { timeout: 10000, reply: true, react: true, keepMessage: true});

        guildTags.forEach(async (tag, index) => { 

            await client.wait(index * 1000);
            message.channel.send(`\`${tag}\``);

        });

        if(guildDiscriminator) await client.wait(guildTags.length * 200).then(() => message.channel.send(`\`#${guildDiscriminator}\``));
     
    },
};