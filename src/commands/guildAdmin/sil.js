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

        let number = args[0];
        let reason = args.slice(1).join(' ');

        if(!number) return message.channel.error(message, `Silinicek mesaj sayısını belirtmelisin!`, { timeout: 6000, reply: true, react: true });
        if(isNaN(number) || number == 0 || number.includes('-')) return message.channel.error(message, `Geçerli bir sayı belirtmelisin!`, { timeout: 6000, reply: true, react: true });
        if(number > 100) return message.channel.error(message, `1 ve 100 arasında bir rakam belirtmelisin!`, { timeout: 6000, reply: true, react: true });

        await message.delete();
        message.channel.bulkDelete(number).then(messages => message.channel.true(message, Embed.setDescription(`**${number}** adet mesaj ${!reason ? '' : `\`${reason}\` nedeniyle`} başarıyla silindi!`), { timeout: 6000 })).catch(() => {});
    
    },
};