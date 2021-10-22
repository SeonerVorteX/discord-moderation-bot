const { Prefix } = global.client.settings;
const { alarm } = require('../../configs/emojis.json');
const alarms = require('../../schemas/alarms');
const ms = require('ms');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'alarm',
    aliases: ['alarmkur'],
    category: 'Kullanıcı',
    usage: '<Süre> <Sebep>',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        let duration = args[0];
        let reason = args.slice(1).join(' ');

        if(!duration) return message.channel.error(message, `Bir süre belirtmelisin!`, { react: true });
        if(!['s', 'sn', 'saniye', 'm', 'minute', 'dk', 'dakika', 'h', 'hour', 'st', 'saat', 'd', 'day', 'g', 'gün'].some(arg => duration.includes(arg))) return message.channel.error(message, `Sadece \`saniye(s, sn)\` , \`dakika(dk, m, minute)\` , \`saat(st, h, hour)\` , \`gün(g, d, day)\` cinsinden bir süre belirtmelisin! Örnek : \`${Prefix}alarm 15dk Arkadaşlarla oyun giricem\``, { react: true });
        if(isNaN(client.replaceDuration(duration)) || client.replaceDuration(duration) == 0 || client.replaceDuration(duration).includes('-')) return message.channel.error(message, `Geçerli bir süre miktarı belirtmelisin`, { react: true });

        duration = await client.ms(duration);

        if(ms(duration.duration) > 86400000) return message.channel.error(message, `En fazla **1 gün** belirte bilirsin!`, { react: true });

        let datas = await alarms.find({ guildID: message.guild.id, userID: message.author.id, finished: false });

        if(datas.length >= 5) return message.channel.error(message, `Görünüşe göre **${datas.length}** aktif alarmın bulunuyor. Yeni bir alarm daha kurmak için aktif alarmlarından birinin bitmesini beklemelisin!`, { reply: true, react: true })

        let Alarm = await client.newAlarm(message.guild.id, message.author.id, message.channel.id, reason ? reason : 'Belirtilmedi!', Date.now(), Date.now()+ms(duration.duration));
        message.channel.success(message, `${alarm ? alarm : `:alarm_clock:`} Alarm${reason ? ` \`${reason}\` nedeniyle` : ''} saat **${moment(Date.now()+ms(duration.duration)).format(`HH:mm`)}** tarihine kuruldu!`, { react: true });

        setTimeout(async () => {

            Alarm.finished = true;
            await Alarm.save();
            message.channel.send(`${alarm ? alarm : `:alarm_clock:`} ${message.author.toString()}, ${client.getTime(ms(duration.duration))} önce ${reason ? `\`${reason}\` sebebiyle` : `\`bilinmeyen\` bir nedenle`} alarm kurmuştun, Hatırladın mı?`);

        }, ms(duration.duration));

    },
};