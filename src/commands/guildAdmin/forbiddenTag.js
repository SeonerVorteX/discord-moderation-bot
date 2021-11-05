const { forbidRoles, forbidChannel, forbidLog } = global.client.guildSettings.forbiddenTag;
const { unregisterRoles } = global.client.guildSettings.registration;
const { dmMessages } = global.client.guildSettings;
const { mark, success } = require('../../configs/emojis.json');
const { Prefix } = global.client.settings;
const forbiddenTag = require('../../schemas/forbiddenTag.js');

module.exports = {
    name: 'yasaklıtag',
    aliases: ['yasaklı-tag', 'forbidden-tag'],
    category: 'Admin',
    usage: '[ekle / sil / say / liste]',
    permission: 'ADMINISTRATOR',
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */
    
    async execute(client, message, args, Embed) {

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yasaklıtag ekle / sil / bilgi / liste\``), { timeout: 8000, react: true });

        let data = await forbiddenTag.findOne({ guildID: message.guild.id });

        if(['ekle', 'add'].some(arg => args[0].toLowerCase() == arg)) {

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yasaklıtag ekle <tag>\``), { timeout: 8000, react: true });

            if(data && data.forbiddenTags.length && data.forbiddenTags.includes(args[1])) return message.channel.error(message, Embed.setDescription(`Belirttiğin tag daha önce yasaklı taglar arasına eklenmiş. Tag hakkında bilgi almak için : \`${Prefix}yasaklıtag bilgi <tag>\``), { timeout: 8000, react: true });

            await forbiddenTag.findOneAndUpdate({ guildID: message.guild.id }, { $push: { forbiddenTags: args[1] } }, { upsert: true });
            let forbiddenMembers = message.guild.members.cache.filter(member => member.user.username.includes(args[1]) && !forbidRoles.some(role => member.roles.cache.has(role)));
            message.channel.success(message, Embed.setDescription(`${success ? success : ``} \`${args[1]}\` tagı başarıyla yasaklı taglar arasına eklendi. Taga sahip üye sayısı **${forbiddenMembers.size}**`), { react: true });
            let index = 0;
            forbiddenMembers.forEach(async member => {

                index += 1;
                await client.wait(index * 250);
                await member.roles.set(forbidRoles).catch(() => {});
                if(dmMessages) member.send(`**${message.guild.name}** adlı sunucunun yasaklı tagları arasına eklenen \`${args[1]}\` tagını kullanıcı adınızda bulundurduğunuz için sunucuya erişiminiz kesildi!`).catch(() => {});
                message.guild.channels.cache.get(forbidChannel).send(`${member.toString()}, kullanıcı adınızda sunucunun yasaklı tagları arasına eklenen \`${args[1]}\` tagını bulundurduğunuz için sunucuya erişiminiz kesildi`);
                message.guild.channels.cache.get(forbidLog).send(`\`${member.user.tag} (${member.user.id})\` kullanıcısının sunucuya erişimi kesildi! \`(Tag: ${args[1]})\``);

            });

        } else if(['sil', 'kaldır', 'remove'].some(arg => args[0].toLowerCase() == arg)) {

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yasaklıtag sil <tag>\``), { timeout: 8000, react: true });

            if(data && data.forbiddenTags.length && !data.forbiddenTags.includes(args[1])) return message.channel.error(message, Embed.setDescription(`Belirttiğin tag daha önce yasaklı taglar arasına eklenmemiş. Tagların listesini görmek için : \`${Prefix}yasaklıtag liste\``), { timeout: 8000, react: true });

            data.forbiddenTags = await data.forbiddenTags.filter(tag => tag !== args[1]);
            await data.save();
            let forbiddenMembers = message.guild.members.cache.filter(member => member.user.username.includes(args[1]) && forbidRoles.some(role => member.roles.cache.has(role)));
            message.channel.success(message, Embed.setDescription(`${success ? success : ``} \`${args[1]}\` tagı başarıyla yasaklı taglar arasından kaldırıldı. Taga sahip üye sayısı **${forbiddenMembers.size}**`), { react: true });
            let index = 0;
            forbiddenMembers.forEach(async member => {

                index += 1;
                await client.wait(index * 250);
                if(dmMessages) member.send(`Kullanıcı adınızda bulunan \`${args[1]}\` tagı **${message.guild.name}** sunucusunun yasaklı tagları arasından kaldırıldığı için sunucuya erişiminiz tekrar açıldı!`).catch(() => {});
                message.guild.channels.cache.get(forbidLog).send(`\`${member.user.tag} (${member.user.id})\` kullanıcısının sunucuya erişimi açıldı! \`(Tag: ${args[1]})\``);
                await member.roles.set(unregisterRoles).catch(() => {});

            });

        } else if(['bilgi', 'info'].some(arg => arg == args[0])) {

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yasaklıtag bilgi <tag>\``), { timeout: 8000, react: true });

            if(data && data.forbiddenTags.length && !data.forbiddenTags.includes(args[1])) return message.channel.error(message, Embed.setDescription(`Belirttiğin tag daha önce yasaklı taglar arasına eklenmemiş. Tagların listesini görmek için : \`${Prefix}yasaklıtag liste\``), { timeout: 8000, react: true });

            let forbiddenMembers = message.guild.members.cache.filter(member => member.user.username.includes(args[1]));
            let onlineMembers = message.guild.members.cache.filter(member => member.user.username.includes(args[1]) && member.user.presence.status !== 'offline');

            let description = `
${success ? success : ``} \`${args[1]}\` tagına ait bilgiler :

\`>\` **Taga sahip kişiler :** \`${forbiddenMembers.size}\`
\`>\` **Taga sahip aktif kişiler :** \`${onlineMembers.size}\`

${forbiddenMembers.size < 10 && forbiddenMembers.size ? `\`>\` **Taga sahip kişilerin listesi :**\n${forbiddenMembers.map(member => member.toString()).join(' , ')}` : !forbiddenMembers.size ? '' : `\`>\` **Taga sahip kişilerin listesini görmek için sayfayı çevirin**`}
            `

            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(description)).then(async msg => {

                if(!forbiddenMembers.size || forbiddenMembers.size < 10) return;
    
                let currentPage = 0;
                let pageArray = forbiddenMembers.array();
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
                    else if (currentPage > 0 && msg) msg.edit(Embed.setTitle(`Taga Sahip Kişilerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index+1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`${Footer} • Sayfa : ${currentPage}`)).catch(err => {});
                
                });
    
                go.on("collect", async reaction => {
    
                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setTitle(`Taga Sahip Kişilerin Listesi :`).setDescription(`${pages[currentPage - 1].map((member, index) => { return `\`${index+1}.\` ${member.toString()} ( \`${member.id}\` )`; }).join('\n')}`).setFooter(`${Footer} • Sayfa : ${currentPage}`));
                
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

        } else if(['liste','tüm', 'hepsi', 'all', 'list'].some(arg => arg == args[0])) {

            if(!data || !data.forbiddenTags.length) return message.channel.error(message, Embed.setDescription(`Sunucuda daha önce bir yasaklı tag eklenmemiş!`), { timeout: 8000, react: true });
            let totalMembers = message.guild.members.cache.filter((member) => new RegExp(data.forbiddenTags.join("|"), "g").test(member.user.username));
            let description = new Array();
            await new Promise(async (resolve) => {

                data.forbiddenTags.forEach(async (tag, index) => {

                    await client.wait(index * 300);
                    let forbiddenMembers = message.guild.members.cache.filter(member => member.user.username.includes(tag));
                    description.push(`**[\`${index+1}\`]** Toplam **${forbiddenMembers.size}** kişide \`${tag}\` tagı bulunuyor!`);
                    
                });
                await client.wait(data.forbiddenTags.length * 300).then(resolve);

            });
            
            message.channel.success(message, Embed.setDescription(`
**${message.guild.name}** sunucusundaki yasaklı taglar :

${description.join('\n')}

\`Toplam :\` **${data.forbiddenTags.length}** yasaklı tag ve **${totalMembers.size}** yasaklı üye bulunuyor!
            `), { react: true });

        } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yasaklıtag  ekle / sil / bilgi / liste \``), { timeout: 8000, react: true });

    },
};