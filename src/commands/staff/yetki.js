const { Prefix, Owners } = global.client.settings;
const { staffGivers, botYt } = global.client.guildSettings;
const { mark, cross, succes } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');
const staffs = require('../../schemas/staffs.js');

module.exports = {
    name: 'yetki',
    aliases: ['staff', 'perm'],
    category: 'Yetkili',
    usage: '[ekle / sil / düzenle / ver / al / bilgi / liste]',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!Owners.includes(message.author.id) && !message.member.hasPermission('MANAGE_ROLES') && !message.member.roles.cache.has(botYt) && !staffGivers.some(role => message.member.roles.cache.has(role))) return;
        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}yetki ekle / sil / düzenle / ver / al / bilgi / liste\``), { timeout: 8000, react: true });

        if(['ekle', 'add'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            if(!Owners.includes(message.author.id) && message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Bu işlem için yeterli yetkin bulunmuyor!`), { timeout: 8000, react: true });

            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Ekleyeceğin yetkinin ismini belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(data) return message.channel.error(message, Embed.setDescription(`Belirttiğin isimde bir yetki zaten bulunuyor!`), { timeout: 8000, react: true });

            let staff = await new staffs({ guildID: message.guild.id, authorID: message.author.id, staffName: name }).save();
            message.channel.true(message, Embed.setDescription(`${succes} \`${staff.staffName}\` isimli bir yetki başarıyla **oluşturuldu!** Yetki ayarlarını düzenlemeyi unutma`), { react: true });

        } else if(['sil', 'remove'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            if(!Owners.includes(message.author.id) && message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Bu işlem için yeterli yetkin bulunmuyor!`), { timeout: 8000, react: true });
            
            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Sileceğin yetkinin ismini belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(!data) return message.channel.error(message, Embed.setDescription(`Veri tabanında \`${name}\` isimli bir yetki bulunamadı!`), { timeout: 8000, react: true });

            if(data.staffRoles.length && data.staffRoles.some(role => message.guild.roles.cache.get(role).position >= message.member.roles.highest.position)) return message.channel.error(message, Embed.setDescription(`Belirttiğin yetkinin rolleri içerisinde seninle aynı veya daha yetkili roller bulunduğu için bu işlemi yapamazsın!`), { timeout: 8000, react: true });

            await staffs.deleteOne({ guildID: message.guild.id, staffName: name });
            message.channel.true(message, Embed.setDescription(`${succes} \`${name}\` isimli bir yetki başarıyla **silindi!**`), { react: true });

        } else if(['düzenle', 'edit'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            if(!Owners.includes(message.author.id) && message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Bu işlem için yeterli yetkin bulunmuyor!`), { timeout: 8000, react: true });
            
            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Düzenleyeceğin yetkinin ismini belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(!data) return message.channel.error(message, Embed.setDescription(`Veri tabanında \`${name}\` isimli bir yetki bulunamadı!`), { timeout: 8000, react: true });

            if(!args[2]) return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}yetki düzenle ${name} ( yetkililer / yetkiler ) <@Rol> <@Rol> <@Rol>\``), { timeout: 8000, react: true });

            if(['yetkiler', 'roller'].some(arg => args[2].toLocaleLowerCase() == arg)) {

                let staffRoles = message.mentions.roles.map(role => role.id);

                if(!staffRoles.length) return message.channel.error(message, Embed.setDescription(`Eklenecek rolleri etiketlemelisin!`), { timeout: 8000, react: true });
                if(message.mentions.roles.some(role => role.members.size == 1 && role.members.first().user.bot && !role.editable)) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true });
                if(staffRoles.some(role => message.guild.roles.cache.get(role).position >= message.member.roles.highest.position)) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol(ler) sahip olduğun en yetkili rol ile aynı veya daha yetkili olduğu için bu rol(ler) eklenemez!`), { timeout: 15000, react: true });

                data.staffRoles = staffRoles;
                await data.save();

                message.channel.true(message, Embed.setDescription(`${succes} \`${name}\` adlı yetkinin rolleri başarıyla ${staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(' , ')} olarak ayarlandı!`), { react: true });

            } else if(['yetkililer', 'staffs'].some(arg => args[2].toLocaleLowerCase() == arg)) {

                let staffs = message.mentions.roles.map(role => role.id);

                if(!staffs.length) return message.channel.error(message, Embed.setDescription(`Eklenecek rolleri etiketlemelisin!`), { timeout: 8000, react: true });
                if(message.mentions.roles.some(role => role.members.size == 1 && role.members.first().user.bot && !role.editable)) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, reply: true, react: true }); 
                if(staffs.some(role => message.guild.roles.cache.get(role).position >= message.member.roles.highest.position)) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol(ler) sahip olduğun en yetkili rol ile aynı veya daha yetkili olduğu için bu rol(ler) eklenemez!`), { timeout: 15000, react: true });

                data.staffs = staffs;
                await data.save();

                message.channel.true(message, Embed.setDescription(`${succes} \`${name}\` adlı yetkinin yetkili rolleri başarıyla ${staffs.map(role => message.guild.roles.cache.get(role).toString()).join(' , ')} olarak ayarlandı!`), { react: true });

            };
            
        } else if(['ver'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Vereceğin yetkinin ismini belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(!data) return message.channel.error(message, Embed.setDescription(`Veri tabanında \`${name}\` isimli bir yetki bulunamadı!`), { timeout: 8000, react: true });

            if(!data.staffs || !data.staffs.length) return message.channel.error(message, Embed.setDescription(`Bu yetkinin yetkili rolleri ayarlanmamış, lütfen yetkinin ayarlarını düzenleyip tekrar deneyin!`), { timeout: 8000, react: true });
            if(!data.staffRoles || !data.staffRoles.length) return message.channel.error(message, Embed.setDescription(`Bu yetkinin rolleri ayarlanmamış, lütfen yetkinin ayarlarını düzenleyip tekrar deneyin!`), { timeout: 8000, react: true });
            if(data.staffRoles.some(role => message.guild.roles.cache.get(role).position >= message.member.roles.highest.position)) return message.channel.error(message, Embed.setDescription(`Belirttiğin yetkinin verilecek rolleri arasında sahip olduğun en yüksek rol ile aynı veya daha yüksek yetkide olan roller bulunduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[2]);

            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(data.staffRoles.every(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`${user.toString()} kullanıcısı zaten belirtilen yetkideki rollere sahip!`), { timeout: 8000, react: true });

            await user.roles.add(data.staffRoles);
            data.staffRoles.forEach(async (role, index) => {

                client.wait(index * 1000);
                await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role, date: Date.now(), type: 'ROLE-ADD' }).save();

            });

            message.channel.true(message, Embed.setDescription(`${succes} ${user.toString()} adlı kullanıcıya başarıyla ${data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(' , ')} rolleri **verildi!**`), { react: true });

        } else if(['al'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Alacağın yetkinin ismini belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(!data) return message.channel.error(message, Embed.setDescription(`Veri tabanında \`${name}\` isimli bir yetki bulunamadı!`), { timeout: 8000, react: true });

            if(!data.staffs || !data.staffs.length) return message.channel.error(message, Embed.setDescription(`Bu yetkinin yetkili rolleri ayarlanmamış, lütfen yetkinin ayarlarını düzenleyip tekrar deneyin!`), { timeout: 8000, react: true });
            if(!data.staffRoles || !data.staffRoles.length) return message.channel.error(message, Embed.setDescription(`Bu yetkinin rolleri ayarlanmamış, lütfen yetkinin ayarlarını düzenleyip tekrar deneyin!`), { timeout: 8000, react: true });
            if(data.staffRoles.some(role => message.guild.roles.cache.get(role).position >= message.member.roles.highest.position)) return message.channel.error(message, Embed.setDescription(`Belirttiğin yetkinin rolleri arasında sahip olduğun en yüksek rol ile aynı veya daha yüksek yetkide olan roller bulunduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[2]);

            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!user) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye belirtmelisin!`), { timeout: 8000, react: true });
            if(!data.staffRoles.every(role => user.roles.cache.has(role))) return message.channel.error(message, Embed.setDescription(`${user.toString()} kullanıcısı zaten belirtilen yetkideki rollere sahip değil!`), { timeout: 8000, react: true });

            await user.roles.remove(data.staffRoles);
            data.staffRoles.forEach(async (role, index) => {

                client.wait(index * 1000);
                await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role, date: Date.now(), type: 'ROLE-REMOVE' }).save();

            });

            message.channel.true(message, Embed.setDescription(`${succes} ${user.toString()} adlı kullanıcıdan başarıyla ${data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(' , ')} rolleri **alındı!**`), { react: true });

        } else if(['bilgi', 'info'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let name = args[1];
            if(!name) return message.channel.error(message, Embed.setDescription(`Bir yetki ismi belirtmelisin!`), { timeout: 8000, react: true });

            let data = await staffs.findOne({ guildID: message.guild.id, staffName: name });
            if(!data) return message.channel.error(message, Embed.setDescription(`Veri tabanında \`${name}\` isimli bir yetki bulunamadı!`), { timeout: 8000, react: true });

            message.channel.true(message, Embed.setDescription(`
${succes} \`${name}\` adlı yetkinin bilgileri :

**Yetki rolleri :** ${data.staffRoles && data.staffRoles.length ? data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
───────────────────
**Yetkili rolleri :** ${data.staffs && data.staffs.length ? data.staffs.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
───────────────────
**Yetkiye sahip üye sayısı :** \`${data.staffs && data.staffs.length ? message.guild.members.cache.filter(member => data.staffRoles.every(role => member.roles.cache.has(role))).size : 0}\`
            `), { react: true });

        } else if(['liste', 'list'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let datas = await staffs.find({ guildID: message.guild.id });
            if(!datas.length) return message.channel.true(message, Embed.setDescription(`${cross} Bu sunucuda her hangi bir yetki eklenmemiş!`), { react: true });

            let firstPage = datas.sort((a, b) => a.date - b.date).splice(0, 4).map((data, index) => `
**[\`${index+1}\`]** \`${data.staffName}\` :
**Yetki rolleri :** ${data.staffRoles && data.staffRoles.length ? data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkili rolleri :** ${data.staffs && data.staffs.length ? data.staffs.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkiye sahip üye sayısı :** \`${data.staffs && data.staffs.length ? message.guild.members.cache.filter(member => data.staffRoles.every(role => member.roles.cache.has(role))).size : 0}\`
            `).join(`\n────────────────────────────\n`)
            message.react(mark);
            message.channel.send(Embed.setDescription(firstPage)).then(async msg => {

                datas = await staffs.find({ guildID: message.guild.id });

                if(datas.length <= 4) return;

                let currentPage = 1;
                let pages = datas.sort((a, b) => a.date - b.date).chunk(4);
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
${pages[currentPage-1].map(data => `
**[\`${datas.indexOf(data)+1}\`]** \`${data.staffName}\` :
**Yetki rolleri :** ${data.staffRoles && data.staffRoles.length ? data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkili rolleri :** ${data.staffs && data.staffs.length ? data.staffs.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkiye sahip üye sayısı :** \`${data.staffs && data.staffs.length ? message.guild.members.cache.filter(member => data.staffRoles.every(role => member.roles.cache.has(role))).size : 0}\`
`).join(`\n────────────────────────────\n`)}
                    `)).catch(err => {});
                        
                });

                go.on("collect", async reaction => {

                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == pages.length) return;
                    currentPage++;
                    if (msg) msg.edit(Embed.setDescription(`
${pages[currentPage-1].map(data => `
**[\`${datas.indexOf(data)+1}\`]** \`${data.staffName}\` :
**Yetki rolleri :** ${data.staffRoles && data.staffRoles.length ? data.staffRoles.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkili rolleri :** ${data.staffs && data.staffs.length ? data.staffs.map(role => message.guild.roles.cache.get(role).toString()).join(` , `) : `\`Ayarlanmamış!\``} 
**Yetkiye sahip üye sayısı :** \`${data.staffs && data.staffs.length ? message.guild.members.cache.filter(member => data.staffRoles.every(role => member.roles.cache.has(role))).size : 0}\`
`).join(`\n────────────────────────────\n`)}
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
 
        } else return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}yetki ekle / sil / düzenle / ver / al / bilgi / liste\``), { timeout: 8000, react: true });

    },
};