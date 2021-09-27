const { Prefix } = global.client.settings;
const { botYt } = global.client.guildSettings;
const { mark } = require('../../configs/emojis.json');
const penalPoints = require('../../schemas/penalPoints');

module.exports = {
    name: 'cezapuan',
    aliases: ['puan'],
    category: 'Admin',
    usage: '[<@Üye/ID> / (ekle / sil)]',
    permission: 'ADMINISTRATOR',
    guildOnly: true, 
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */

    async execute(client, message, args) {

        if(!args[0]) {

            let data = await penalPoints.findOne({ guildID: message.guild.id, userID: message.author.id });
            message.channel.success(message, `Ceza Puanın : **${data && data.penalPoint ? data.penalPoint : 0}**`, { react: true });

        } else if(['ekle', 'add'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let point = args[2];
            let reason = args.slice(3).join(' ');

            if(!args[1]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(user.hasPermission(8) || user.roles.cache.has(botYt) || user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Yetkili birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
            if(!point) return message.channel.error(message, `Eklenecek puan miktarını belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(isNaN(point) || point == 0 || point.includes('-')) return message.channel.error(message, `Geçerli bir puan miktarını belirtmelisin!`, { timeout: 8000, reply: true, react: true });

            let data = await penalPoints.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, { $inc: { penalPoint: point } }, { upsert: true });

            message.channel.success(message, `\`${user.displayName}\` üyesinin ceza puanı${reason ? ` \`${reason}\` sebebiyle` : ``} **${point}** puan artırıldı!`, { react: true });

        } else if(['sil', 'çıkar', 'remove'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let point = args[2];
            let reason = args.slice(3).join(' ');

            if(!args[1]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(user.hasPermission(8) || user.roles.cache.has(botYt) || user.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, `Yetkili birine bu işlemi uygulayamazsın!`, { timeout: 8000, reply: true, react: true });
            if(!point) return message.channel.error(message, `Silinecek puan miktarını belirtmelisin!`, { timeout: 8000, reply: true, react: true });
            if(isNaN(point) || point == 0 || point.includes('-')) return message.channel.error(message, `Geçerli bir puan miktarını belirtmelisin!`, { timeout: 8000, reply: true, react: true });

            let data = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });

            if(!data || data.penalPoint < point) return message.channel.error(message, `\`${user.displayName}\` üyesinin belirtilen miktarda silinecek kadar puanı yok. Sahip olduğu ceza puanı : **${data && data.penalPoint ? data.penalPoint : 0}**`, { react: true });

            data = await penalPoints.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, { $inc: { penalPoint: -point } }, { upsert: true });

            message.channel.success(message, `\`${user.displayName}\` üyesinin ceza puanı${reason ? ` \`${reason}\` sebebiyle` : ``} **${point}** puan eksildi!`, { react: true });

        } else if(args[0]) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            if(!user) return message.channel.error(message, `${mark ? mark : ``}  Doğru kullanım : \`${Prefix}cezapuan <@Üye/ID> / (ekle / sil)\``, { timeout: 8000, reply: true, react: true });

            let data = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });
            message.channel.success(message, `\`${user.displayName}\` Üyesinin Ceza Puanı : **${data && data.penalPoint ? data.penalPoint : 0}**`, { react: true });

        };

    },
};