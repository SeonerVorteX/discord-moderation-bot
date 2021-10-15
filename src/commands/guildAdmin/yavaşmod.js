module.exports = {
    name: 'yavaşmod',
    aliases: ['slowmode'],
    category: 'Admin',
    usage: '<Saniye Cinsinden Sayı>',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */

    execute(client, message, args) {

        let number = args[0];

        if(!number) return message.channel.error(message, `Yavaşmodun ayarlanması için bir sayı belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(isNaN(number) || number.includes('-')) return message.channel.error(message, `Geçerli bir sayı belirtmelisin!`, { timeout: 8000, reply: true, react: true });
        if(number > 21600) return message.channel.error(message, `En fazla **21600** saniye \`(6 saat)\` belirte bilirsin!`, { timeout: 8000, reply: true, react: true });
        if(message.channel.rateLimitPerUser == number) return message.channel.error(message, `Yavaş mod zaten ${number == 0 ? `kapatılmış!` : `**${number} saniye** olarak ayarlanmış!`}`, { timeout: 8000, reply: true, react: true });

        message.channel.setRateLimitPerUser(args[0]);
        message.channel.success(message, `Yavaş mod başarıyla ${number == 0 ? `kapatıldı!` : `**${number} saniye** olarak ayarlandı!`}`, { react: true });

    },
};