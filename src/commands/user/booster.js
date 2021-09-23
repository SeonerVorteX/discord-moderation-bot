const { guildTags, nameTag } = global.client.guildSettings;

module.exports = {
    name: 'booster',
    aliases: ['zengin'],
    category: 'Kullanıcı',
    usage: '<İsim>',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    execute(client, message, args, Embed) {

        if(!message.member.premiumSinceTimestamp) return message.channel.error(message, `Bu komutu kullanmak için önce boost basmanız gerekiyor!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(!args[0]) return message.channel.error(message, `Bir isim belirtin!`, { timeout: 10000, reply: true, react: true, keepMessage: true });

        let name = args.slice(0).join(' ');

        if(name.length > 25) return message.channel.error(message, `İsminiz 25 karakterden fazla olamaz!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(guildTags.length) {

            let displayName = message.member.displayName.replace(nameTag, '');
            guildTags.filter(tag => displayName.includes(tag)).forEach(tag => displayName = displayName.replace(tag, ''));

            if(name.trim() == displayName.trim()) return message.channel.error(message, `Sunucudaki ismin zaten böyle!`, { timeout: 10000, reply: true, react: true, keepMessage: true });

        } else if(message.member.displayName.trim() == name.trim()) return message.channel.error(message, `Sunucudaki ismin zaten böyle!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(message.member.manageable) {

            message.channel.success(message, Embed.setDescription(`İsminiz başarıyla **${!nameTag ? "" : nameTag} ${name}** olarak değiştirildi!`), { react: true, deleteMessage: 8000 });
            message.member.setNickname(`${!nameTag ? "" : nameTag} ${name}`);

        } else message.channel.error(message, `Bu işlem için yeterli yetkim yok!`, { timeout: 10000, react: true, keepMessage: true });

    },
};