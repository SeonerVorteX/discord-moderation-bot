const { Footer } = global.client.settings;
const { success, mark, mark2, cross2 } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'rollog',
    aliases: ['rolelog'],
    category: 'Admin',
    usage: '<@Üye/ID>',
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
        
        if(args[0] && !user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
    
        if(user) {

            let datas = await roleLog.find({ guildID: message.guild.id, userID: user.id }).sort({ date: -1 });

            if(!datas.length) return message.channel.success(message, Embed.setDescription(`${user.toString()} kullanıcısına ait bir veri bulunamadı!`), { react: true });

            let currentPage = 1;
            let firstPage = `
${success ? success : ``} ${user.toString()} isimli kullanıcının **${datas.length}** rol bilgisi bulundu :

${datas.splice(0, 10).map(data => `**[\`${data.type}\`]** ${user.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}      
            `;

            if(mark) message.react(mark)
            message.channel.send(Embed.setDescription(firstPage).setFooter(datas.length <= 10 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                datas = await roleLog.find({ guildID: message.guild.id, userID: user.id }).sort({ date: -1 });

                if(datas.length <= 10) return;

                let pages = datas.chunk(10);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : ${currentPage}`));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(data => `**[\`${data.type}\`]** ${user.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(data => `**[\`${data.type}\`]** ${user.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}
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

            let datas = await roleLog.find({ guildID: message.guild.id, userID: message.author.id }).sort({ date: -1 });

            if(!datas.length) return message.channel.success(message, Embed.setDescription(`Size ait bir veri bulunamadı!`), { react: true });

            let currentPage = 1;
            let firstPage = `
${success ? success : ``} ${message.author.toString()} isimli kullanıcının **${datas.length}** rol bilgisi bulundu :

${datas.splice(0, 10).map(data => `**[\`${data.type}\`]** ${message.member.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}      
            `;

            if(mark) message.react(mark)
            message.channel.send(Embed.setDescription(firstPage).setFooter(datas.length <= 10 ? Footer : `${Footer} • Sayfa : ${currentPage}`)).then(async msg => {

                datas = await roleLog.find({ guildID: message.guild.id, userID: message.author.id }).sort({ date: -1 });

                if(datas.length <= 10) return;

                let pages = datas.chunk(10);
                let reactions = ['◀', '❌', '▶'];
                for (let reaction of reactions) await msg.react(reaction);
                    
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
                const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
                const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

                back.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return;
                    currentPage--;
                    if(currentPage == 1 && msg) msg.edit(Embed.setDescription(firstPage).setFooter(`${Footer} • Sayfa : ${currentPage}`));
                    else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(data => `**[\`${data.type}\`]** ${message.member.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}
                    `).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(data => `**[\`${data.type}\`]** ${message.member.roles.cache.has(data.roleID) ? (mark2 ? mark2 : ``) : (cross2 ? cross2 : ``)} **Rol :** ${message.guild.roles.cache.get(data.roleID) ? message.guild.roles.cache.get(data.roleID) : `@deleted-role`} **Yetkili :** ${client.users.cache.has(data.staffID) ? client.users.cache.get(data.staffID).toString() : `<@${data.staffID}>`}\n**Tarih :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\``).join('\n**────────────────────**\n')}
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