const { arrow, online, dnd, idle, offline, web, stream, mobile } = require('../../configs/emojis.json');
const penals = require('../../schemas/penals.js');
const penalPoints = require('../../schemas/penalPoints.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'üyebilgi',
    aliases: ['kullanıcıbilgi', 'kb'],
    category: 'Yetkili',
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
            desktop: `${stream} Masaüstü Uygulaması`,
            web: `${web} Web Tarayıcısı`,
            mobile: `${mobile} Mobil Uygulama`,
        };
        let userStatus = {
            online: `${online} Çevrimiçi`,
            dnd: `${dnd} Rahatsız Etmeyin`,
            idle: `${idle} Boşta`,
            offline: `${offline} Çevrimdışı`
        }
        let clientStat = user.user.presence.clientStatus ? Object.keys(user.user.presence.clientStatus).map(activity => clientStatus[activity]).join(' , ') : `Bilinmiyor!`;
        let userStat = userStatus[user.user.presence.status];
        let customStatus = user.user.presence.activities.length && user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').state ? user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').state : ``;
        let emoji = user.user.presence.activities.length && user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').emoji ? `${user.user.presence.activities.find(activity => activity.type == 'CUSTOM_STATUS').emoji.toString()} ` : ``;
        let userPenals = await penals.find({ guildID: message.guild.id, userID: user.id });
        let penalPoint = await penalPoints.findOne({ guildID: message.guild.id, userID: user.id });

        message.channel.true(message, 
            Embed
            .setAuthor(``, ``)
            .setThumbnail(user.user.avatarURL({ dynamic: true }))
            .setDescription(`
**${arrow} Kullanıcı Bilgileri**
\`•>\` **ID :** ${user.id}
\`•>\` **Kullanıcı tagı :** ${user.user.tag} 
\`•>\` **Hesabının açılma tarihi :** ${moment(user.user.createdAt).format('DD MMMM YYYY HH:mm')}
\`•>\` **İstemci :** ${clientStat}
\`•>\` **Status :** ${userStat}
\`•>\` **Özel Durum :** ${!customStatus && !emoji ? `Bulunmuyor!` : !customStatus && emoji ? emoji : customStatus && !emoji && customStatus.length < 50 ? customStatus : customStatus && emoji && customStatus.length < 50 ? `${emoji} ${customStatus}` : customStatus && customStatus.length > 50 ? `*Çok uzun*` : ``}
\`•>\` **Aktiviteler :** ${!user.user.presence.activities.filter(activity => activity.type !== 'CUSTOM_STATUS').length ? `\`Bulunmuyor\`` : user.user.presence.activities.filter(activity => activity.type !== 'CUSTOM_STATUS').map((activity, index) => `\n**${index+1}.** ${activity.name ? `\`${activity.name}\` ` : ``}${activity.type.replace('PLAYING', 'Oynuyor').replace('LISTENING', 'Dinliyor').replace('WATCHING', 'İzliyor') .replace('STREAMING', 'Yayını Yapıyor')}`).join(`\n`)}
                
**${arrow} Üye Bilgileri**
\`•>\` **Sunucudaki ismi :** ${user.displayName} 
\`•>\` **Sunucuya Katılma tarihi :** ${moment(user.joinedAt).format('DD MMMM YYYY HH:mm')}
\`•>\` **Sunucudaki Rolleri :** ${Object(user.roles.cache.array().filter(role => role.name !== '@everyone').sort((a, b) => b.position - a.position)).splice(0, 3).map(role => role.toString())} ${user.roles.cache.filter(role => role.name !== '@everyone').size-3 == 0 || (user.roles.cache.filter(role => role.name !== '@everyone').size-3).toLocaleString().includes('-') ? `` : `....**${user.roles.cache.filter(role => role.name !== '@everyone').size-3}+**`}     
\`•>\` **Aldığı Ceza Sayısı :** ${userPenals.length ? userPenals.length : 0}
\`•>\` **Ceza Puanı :** ${penalPoint ? penalPoint.penalPoint : 0}
    `)
        , { react: true });

    },
};