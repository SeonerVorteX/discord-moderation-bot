const { muted, unMuted, deafen, unDeafen } = require('../../configs/emojis.json');
const voiceJoinedAt = require('../../schemas/voiceJoinedAt.js');
const moment = require('moment');
moment.locale('tr');
require('moment-duration-format');

module.exports = {
    name: 'ses',
    aliases: ['n', 'voice'],
    category: 'Admin',
    usage: '[<@Üye/ID> / <#Kanal/ID>]',
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

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if(!args[0]) {

            let voiceData = await voiceJoinedAt.findOne({ guildID: message.guild.id, userID: message.author.id });

            if(!message.member.voice.channel) return message.channel.error(message, Embed.setDescription(`Herhangi bir ses kanalında bulunmuyorsun!`), { timeout: 8000, react: true });

            message.channel.success(message, Embed.setDescription(`
${message.member.voice.channel.toString()} adlı ses kanalınaki bilgilerin :

**Mikrofonun :** ${message.member.voice.selfMute || message.member.voice.serverMute ? `Kapalı ${muted ? muted : ``}` : `Açık ${unMuted ? unMuted : ``}`}
**Kulaklığın :** ${message.member.voice.selfDeaf || message.member.voice.serverDeaf ? `Kapalı ${deafen ? deafen : ``}` : `Açık ${unDeafen ? unDeafen : ``}`}
**Veri Bilgilerin :** ${!voiceData ? `\`Veri Bulunamadı!\`` : `Toplam \`${await client.duration(Date.now() - voiceData.date)}dir\` sestesin!`}
            `), { react: true });

        } else if(user) {

            
            if(user.id == message.author.id ) {
                
                let voiceData = await voiceJoinedAt.findOne({ guildID: message.guild.id, userID: message.author.id });

                if(!message.member.voice.channel) return message.channel.error(message, Embed.setDescription(`Herhangi bir ses kanalında bulunmuyorsun!`), { timeout: 8000, react: true });

                message.channel.success(message, Embed.setDescription(`
${message.member.voice.channel.toString()} adlı ses kanalınaki bilgilerin :

**Mikrofonun :** ${message.member.voice.selfMute || message.member.voice.serverMute ? `Kapalı ${muted ? muted : ``}` : `Açık ${unMuted ? unMuted : ``}`}
**Kulaklığın :** ${message.member.voice.selfDeaf || message.member.voice.serverDeaf ? `Kapalı ${deafen ? deafen : ``}` : `Açık ${unDeafen ? unDeafen : ``}`}
**Veri Bilgilerin :** ${!voiceData ? `\`Veri Bulunamadı!\`` : `Toplam \`${await client.duration(Date.now() - voiceData.date)}dir\` sestesin!`}
                `), { react: true });

                
            } else {

                let voiceData = await voiceJoinedAt.findOne({ guildID: message.guild.id, userID: user.id });

                if(!user.voice.channel) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye herhangi bir ses kanalında bulunmuyor!`), { timeout: 8000, react: true });

                message.channel.success(message, Embed.setDescription(`
${user.toString()} isimli kullanıcının sesteki bilgileri :

**Kullanıcının Mikrofonu :** ${user.voice.selfMute || user.voice.serverMute ? `Kapalı ${muted ? muted : ``}` : `Açık ${unMuted ? unMuted : ``}`}
**Kullanıcının Kulaklığı :** ${user.voice.selfDeaf || user.voice.serverDeaf ? `Kapalı ${deafen ? deafen : ``}` : `Açık ${unDeafen ? unDeafen : ``}`}
**Veri Bilgileri :** ${!voiceData ? `\`Veri Bulunamadı!\`` : `Toplam \`${await client.duration(Date.now() - voiceData.date)}dir\` seste!`}
                `), { react: true });

            };

        } else if(channel) {

            if(channel.type !== 'voice') return message.channel.error(message, Embed.setDescription(`Belirttiğin kanal bir ses kanalı değil!`), { timeout: 8000, react: true });
            if(channel.members.size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin ses kanalında her hangi bir üye bulunmuyor`), { timeout: 8000, react: true });
            
            let voiceDatas = await voiceJoinedAt.find({ guildID: message.guild.id }).sort({ date: -1 });
            
            if(channel.members.size >= 15) {
                
                let currentPage = 1;
                let pageArray = channel.members.array();
                let pages = pageArray.chunk(10);
                let description = `
${channel.toString()} adlı kanaldaki üyelerin bilgileri :

${pages[0].map((member) => `${member.toString()} : \`${voiceDatas && voiceDatas.find(data => data.userID == member.user.id) ? moment.duration(Date.now() - voiceDatas.find(data => data.userID == member.user.id).date).format(`D [gün] H [saat] m [dakika] s [saniye]`) : `Veri Bulunamadı`}\` - ( ${member.voice.selfMute || member.voice.serverMute ? muted : unMuted} / ${member.voice.selfDeaf || member.voice.serverDeaf ? deafen : unDeafen} )`).join('\n')}
                `
                message.channel.send(Embed.setDescription(description)).then(async msg => {

                    let reactions = ['◀', '❌', '▶'];
                    for (let reaction of reactions) await msg.react(reaction);
                
                    const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                    const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                    const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                    back.on("collect", async reaction => {

                        await reaction.users.remove(message.author.id).catch(err => {});
                        if (currentPage == 1) return;
                        currentPage--;
                        if(currentPage == 1 && msg) msg.edit(Embed.setDescription(description));
                        else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`${pages[currentPage - 1].map((member) => `${member.toString()} : \`${voiceDatas && voiceDatas.find(data => data.userID == member.user.id) ? moment.duration(Date.now() - voiceDatas.find(data => data.userID == member.user.id).date).format(`D [gün] H [saat] m [dakika] s [saniye]`) : `Veri Bulunamadı`}\` - ( ${member.voice.selfMute ? muted : unMuted} / ${member.voice.selfDeaf ? deafen : unDeafen} )`).join('\n')}`)).catch(err => {});
                    
                    });

                    go.on("collect", async reaction => {

                        await reaction.users.remove(message.author.id).catch(err => {});
                        if (currentPage == pages.length) return;
                        currentPage++;
                        if (msg) msg.edit(Embed.setDescription(`${pages[currentPage - 1].map((member) => `${member.toString()} : \`${voiceDatas && voiceDatas.find(data => data.userID == member.user.id) ? moment.duration(Date.now() - voiceDatas.find(data => data.userID == member.user.id).date).format(`D [gün] H [saat] m [dakika] s [saniye]`) : `Veri Bulunamadı`}\` - ( ${member.voice.selfMute || member.voice.serverMute ? muted : unMuted} / ${member.voice.selfDeaf || member.voice.serverDeaf ? deafen : unDeafen} )`).join('\n')}`));
                    
                    });
                    
                    x.on("collect", async reaction => {

                        await back.stop();
                        await go.stop();
                        await x.stop();
                        if (message) message.delete().catch(err => {});
                        if (msg) return msg.delete().catch(err => {});

                    });

                    back.on("end", async () => {

                        await back.stop();
                        await go.stop();
                        await x.stop();
                        await msg.reactions.removeAll();
                        //if (message) message.delete().catch(err => {});
                        //if (msg) return msg.delete().catch(err => {});
                        
                    });

                });

            } else {

                message.channel.success(message, Embed.setDescription(`
${channel.toString()} adlı kanaldaki üyelerin bilgileri :

${channel.members.map((member) => `${member.toString()} : \`${voiceDatas && voiceDatas.find(data => data.userID == member.user.id) ? moment.duration(Date.now() - voiceDatas.find(data => data.userID == member.user.id).date).format(`D [gün] H [saat] m [dakika] s [saniye]`) : `Veri Bulunamadı`}\` - ( ${member.voice.selfMute || member.voice.serverMute ? muted : unMuted} / ${member.voice.selfDeaf || member.voice.serverDeaf ? deafen : unDeafen} )`).join('\n')}
                `), { react: true });

            };

        } else return message.channel.error(message, Embed.setDescription(`Geçerli bir üye veya ses kanalı belirtmelisin!`), { timeout: 8000, react: true });

    },
};
