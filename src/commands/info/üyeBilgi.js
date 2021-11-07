const { arrow, online, dnd, idle, offline, web, stream, mobile } = require('../../configs/emojis.json');
const penals = require('../../schemas/penals.js');
const penalPoints = require('../../schemas/penalPoints.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'üyebilgi',
    aliases: ['kullanıcıbilgi', 'kb'],
    category: 'Bilgi',
    usage: '<@Üye/ID>',
    staff: true,
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let clientStatus = {
            desktop: `${stream ? stream : `:desktop:`} Masaüstü`,
            web: `${web ? web : ``} Web Tarayıcısı`,
            mobile: `${mobile ? mobile : ``} Mobil`,
        };
        let userStatus = {
            online: `${online ? online : ``} Çevrimiçi`,
            dnd: `${dnd ? dnd : ``} Rahatsız Etmeyin`,
            idle: `${idle ? idle : ``} Boşta`,
            offline: `${offline ? offline : ``} Çevrimdışı`
        };
        let clientStat = user.user.presence.clientStatus ? Object.keys(user.user.presence.clientStatus).map(activity => clientStatus[activity]).join(' , ') : `Bilinmiyor!`;
        let userStat = userStatus[user.user.presence.status];
        let customStatus = user.user.presence.activities.filter(activity => activity.type == 'CUSTOM_STATUS').length && user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').state ? user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').state : ``;
        let emoji = user.user.presence.activities.filter(activity => activity.type == 'CUSTOM_STATUS').length && user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').emoji && !user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').emoji.id ? `${user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').emoji.toString()} ` : ``;
        let userPenals = await penals.find({ guildID: message.guild.id, userID: user.id });
        let penalPoint = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });

        message.channel.success(message, 
            Embed
            .setColor(user.roles.highest.color == 0 ? 'RANDOM' : user.roles.highest.color)
            .setAuthor(``, ``)
            .setThumbnail(user.user.avatarURL({ dynamic: true }))
            .setDescription(`
**${arrow ? arrow : ``} Kullanıcı Bilgileri**
\`•>\` **ID :** ${user.id}
\`•>\` **Kullanıcı tagı :** ${user.user.tag} 
\`•>\` **Hesabının açılma tarihi :** ${moment(user.user.createdAt).format(`DD MMMM YYYY (HH:mm)`)}
\`•>\` **İstemci :** ${clientStat}
\`•>\` **Status :** ${userStat}
\`•>\` **Özel Durum :** ${!customStatus && !emoji ? `Bulunmuyor!` : !customStatus && emoji ? emoji : customStatus && !emoji && customStatus.length < 50 ? customStatus : customStatus && emoji && customStatus.length < 50 ? `${emoji} ${customStatus}` : customStatus && !emoji && customStatus.length > 50 ? `*Çok uzun*` : `${emoji} *Çok uzun*`}
\`•>\` **Aktiviteler :** ${!user.user.presence.activities.filter(activity => activity.type !== 'CUSTOM_STATUS').length ? `Bulunmuyor!` : user.user.presence.activities.filter(activity => activity.type !== 'CUSTOM_STATUS').map((activity, index) => `\n**${index+1}.** ${activity.name && activity.name == 'Spotify' ? `\`${activity.name}'da ${activity.details ? `"${activity.details}" Şarkısını` : `Bir Şeyler`}\`` : activity.name ? `\`${activity.timestamps && activity.timestamps.start ? `${moment.duration(Date.now() - activity.timestamps.start.getTime()).format(`D [gün,] H [saat,] m [dakika,] s [saniyedir]`)} ` : ``}"${activity.name}"\`` : `Bir Şeyler`} ${activity.type.replace('PLAYING', 'Oynuyor').replace('LISTENING', 'Dinliyor').replace('WATCHING', 'İzliyor') .replace('STREAMING', 'Yayını Yapıyor')}`)}
                
**${arrow ? arrow : ``} Üye Bilgileri**
\`•>\` **Sunucudaki ismi :** ${user.displayName} 
\`•>\` **Sunucuya Katılma tarihi :** ${moment(user.joinedAt).format(`DD MMMM YYYY (HH:mm)`)}
\`•>\` **Sunucudaki Rolleri :** ${Object(user.roles.cache.array().filter(role => role.name !== '@everyone').sort((a, b) => b.position - a.position)).splice(0, 3).map(role => role.toString())} ${user.roles.cache.filter(role => role.name !== '@everyone').size-3 == 0 || (user.roles.cache.filter(role => role.name !== '@everyone').size-3).toLocaleString().includes('-') ? `` : `, **${user.roles.cache.filter(role => role.name !== '@everyone').size-3}+**`}     
\`•>\` **Aldığı Ceza Sayısı :** ${userPenals.length ? userPenals.length : 0}
\`•>\` **Ceza Puanı :** ${penalPoint ? penalPoint.penalPoint : 0}
    `)
        , { react: true });

    },
};
