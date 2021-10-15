const { Footer } = global.client.settings;
const { mark, mark2, cross2, muted, chatMuted, jailed, banned, warned } = require('../../configs/emojis.json');
const penals = require('../../schemas/penals');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'sicilbilgi',
    aliases: ['sicil', 'sicil-bilgi', 'cezalog', 'cezalılog'],
    category: 'Bilgi',
    usage: '<@Üye/ID>',
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

    async execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(args[0] && !user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });

        if(user) {

            let Penals = await penals.find({ guildID: message.guild.id, userID: user.id });
            
            if(!Penals.length) return message.channel.success(message, Embed.setDescription(`${user.toString()} üyesinin herhangi bir ceza kaydı bulunmuyor!`), { react: true });
            
            let firstPage = Penals.sort((a, b) => a.date - b.date).splice(0, 10).map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almış`).join('\n\n');
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : 1`)).then(async msg => {

                Penals = await penals.find({ guildID: message.guild.id, userID: user.id });

                if(Penals.length < 11) return;

                let currentPage = 1;
                let pages = Penals.sort((a, b) => a.date - b.date).chunk(10);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPage));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almış`).join('\n\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almış`).join('\n\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});

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

            let Penals = await penals.find({ guildID: message.guild.id, userID: message.author.id });
            
            if(!Penals.length) return message.channel.success(message, Embed.setDescription(`${message.author.toString()} Herhangi bir ceza kaydın bulunmuyor!`), { react: true });
            
            let firstPage = Penals.sort((a, b) => a.date - b.date).splice(0, 10).map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almışsın`).join('\n\n');
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : 1`)).then(async msg => {

                Penals = await penals.find({ guildID: message.guild.id, userID: message.author.id });

                if(Penals.length < 11) return;

                let currentPage = 1;
                let pages = Penals.sort((a, b) => a.date - b.date).chunk(10);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPenal));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almışsın`).join('\n\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == Penals.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(penal => `**[\`#${penal.id}\`]** ${penal.active ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **[${penal.type}]** <@${penal.staffID}> tarafından **${moment(penal.date).format("DD MMMM YYYY (HH:mm)")}** tarihinde ${!penal.reason || penal.reason == 'Belirtilmedi!' ? '' : `\`${penal.reason}\` sebebiyle`} ${penal.type == 'BAN' || penal.type == 'FORCE-BAN' ? (banned ? banned : ``) : penal.type == 'JAIL' || penal.type == 'TEMP-JAIL' ? (jailed ? jailed : ``) : penal.type == 'CHAT-MUTE' ? (chatMuted ? chatMuted : ``) : penal.type == 'VOICE-MUTE' ? (muted ? muted : ``) : (warned ? warned : ``)} **${penal.type.toLowerCase().replace("-", " ")}** cezası almışsın`).join('\n\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});

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

        };

    },
};