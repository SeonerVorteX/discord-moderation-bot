const voiceData = require('../../schemas/voiceData.js');
const messageData = require('../../schemas/messageData.js');
const { Footer } = global.client.settings;
const { guildTags } = global.client.guildSettings;

module.exports = {
    name: 'denetim',
    aliases: ['roldenetim'],
    category: 'Yetkili',
    usage: '<@Rol/ID>',
    permission: 'MANAGE_ROLES',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

        if(!args[0]) return message.channel.error(message, `Bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true })
        if(!role) return message.channel.error(message, `Geçerli bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true })
        if(role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true });

        let tagMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && guildTags.filter(tag => tag !== '').some(tag => member.user.username.includes(tag))).size;
        let onlineMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && member.user.presence.status !== 'offline').size;
        let voiceMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id) && member.voice.channelID).size;

        let voice = await voiceData.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        voice = voice.filter(x => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
        let vcData = voice.length > 0 ? voice.splice(0, 5).map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${moment.duration(x["topStat"]).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`) : "Veri bulunmuyor!";

        let msgdata = await messageData.find({ guildID: message.guild.id }).sort({ topStat: -1 });
        msgdata = msgdata.filter(x => message.guild.members.cache.has(x.userID) && message.guild.members.cache.get(x.userID).roles.cache.has(role.id));
        let msgData = msgdata.length > 0 ? msgdata.splice(0, 5).map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${Number(x["topStat"]).toLocaleString()} mesaj\``).join(`\n`) : "Veri bulunmuyor!";


        let description = `
${role.toString()} ( \`${role.id}\` ) rolüne ait bilgiler :

\`>\` **Role sahip kişiler :** \`${role.members.size}\`
\`>\` **Toplam ses bilgileri :** \`${vcData}\`
\`>\` **Toplam mesaj bilgileri :** \`${msgData}\`

\`>\` **Role sahip taglı kişiler :** \`${!guildTags.length ? 0 : !tagMembers ? 0 : tagMembers}\`
\`>\` **Role sahip aktif kişiler :** \`${!onlineMembers ? 0 : onlineMembers}\`
\`>\` **Role sahip sesteki kişiler :** \`${!voiceMembers ? 0 : voiceMembers}\`

${role.members.size < 10 && role.members.size ? `\`>\` **Role sahip kişilerin listesi :**\n${role.members.map(member => member.toString()).join(' , ')}` : !role.members.size ? '' : `\`>\` **Role sahip kişilerin listesini görmek için sayfayı çevirin**`}
        `;

        message.channel.send(Embed.setDescription(description)).then(async msg => {

            if(!role.members.size || role.members.size < 10) return;

            let currentPage = 0;
            let pageArray = role.members.array();
            let pages = pageArray.chunk(10);

            let reactions = ['◀', '❌', '▶'];
            for (let reaction of reactions) await msg.react(reaction);

            const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id, { time: 40000 });
            const x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id, { time: 40000 });
            const go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id, { time: 40000 });

            back.on("collect", async reaction => {

                await reaction.users.remove(message.author.id).catch(err => {});
                if (currentPage == 0) return;
                currentPage--;
                if(currentPage == 0 && msg) msg.edit(Embed.setTitle("").setDescription(description).setFooter(Footer));
                else if (currentPage > 0 && msg) msg.edit(Embed.setTitle(`Roldeki Üyelerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index+1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`Sayfa : ${currentPage}`)).catch(err => {});
            
            });

            go.on("collect", async reaction => {

                await reaction.users.remove(message.author.id).catch(err => {});
                if (currentPage == pages.length) return;
                currentPage++;
                if (msg) msg.edit(Embed.setTitle(`Roldeki Üyelerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index+1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`Sayfa : ${currentPage}`));
            
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