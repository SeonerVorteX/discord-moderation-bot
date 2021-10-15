const { Owners } = global.client.settings;
const { unAuthorizedMessages, botYt, penals } = global.client.guildSettings;
const { staffs } = penals.warn;
const Penals = require('../../schemas/penals.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: 'warnbilgi',
    aliases: ['uyarıbilgi', 'uyarı-bilgi'],
    category: 'Bilgi',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */
    
    async execute(client, message, args, Embed) {

        if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt) && !staffs.some(role => message.member.roles.cache.has(role))) {
            if(unAuthorizedMessages) return message.channel.error(message, Embed.setDescription(`Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`), { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.mentions.users.first() || message.guild.members.cache.get(args[0]) || client.users.cache.get(args[0]) || await client.fetchUser(args[0]).then(user => user);

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
        if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin`), { timeout: 8000, react: true });

        let penal = await Penals.find({ guildID: message.guild.id, userID: user.id, type: 'WARN' });

        if(!penal.length) return message.channel.error(message, Embed.setDescription(`Belirtilen üye daha önce uyarılmamış`), { timeout: 8000, react: true });

        let currentPage = 1;
        let description = `
**[\`1\`]** ${user.toString()} kullanıcısının uyarı bilgileri :

**Ceza ID :** \`#${penal[0].id}\`
**Uyarılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Uyaran Yetkili :** \`${client.users.cache.get(penal[0].staffID).tag} (${client.users.cache.get(penal[0].staffID).id})\`
**Uyarılma Tarihi :** \`${moment(penal[0].date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Uyarılma Sebebi :** \`${!penal[0].reason ? 'Belirtilmedi!' : penal[0].reason}\`
        `;

        message.channel.send(Embed.setDescription(description)).then(async msg => {

            if(penal.length == 1) return;

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
                else if (currentPage > 1 && msg) msg.edit(Embed.setDescription(`
**[\`${currentPage}\`]** ${user.toString()} kullanıcısının uyarı bilgileri :

**Ceza ID :** \`#${penal[currentPage-1].id}\`
**Uyarılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Uyaran Yetkili :** \`${client.users.cache.get(penal[currentPage-1].staffID).tag} (${client.users.cache.get(penal[currentPage-1].staffID).id})\`
**Uyarılma Tarihi :** \`${moment(penal[currentPage-1].date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Uyarılma Sebebi :** \`${!penal[currentPage-1].reason ? 'Belirtilmedi!' : penal[currentPage-1].reason}\`
                `)).catch(err => {});
                    
            });

            go.on("collect", async reaction => {

                await reaction.users.remove(message.author.id).catch(err => {});
                if (currentPage == penal.length) return;
                currentPage++;
                if (msg) msg.edit(Embed.setDescription(`
**[\`${currentPage}\`]** ${user.toString()} kullanıcısının uyarı bilgileri :
                
**Ceza ID :** \`#${penal[currentPage-1].id}\`
**Uyarılan Kullanıcı :** \`${user.user.tag} (${user.user.id})\`
**Uyaran Yetkili :** \`${client.users.cache.get(penal[currentPage-1].staffID).tag} (${client.users.cache.get(penal[currentPage-1].staffID).id})\`
**Uyarılma Tarihi :** \`${moment(penal[currentPage-1].date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Uyarılma Sebebi :** \`${!penal[currentPage-1].reason ? 'Belirtilmedi!' : penal[currentPage-1].reason}\`
                `)).catch(err => {});

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

    },
};