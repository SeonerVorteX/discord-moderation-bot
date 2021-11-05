const { Prefix } = global.client.settings;
const { mark, loading, success } = require('../../configs/emojis.json');
const administrators = require('../../schemas/administrators.js');

module.exports = {
    name: 'yönetici',
    aliases: ['yt'],
    category: 'Admin',
    usage: '[aç / kapat / al / ver / bilgi ( üye / bot )]',
    guildOwner: true,
    guildOnly: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } Embed 
     */

    async execute(client, message, args, Embed) {

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici  aç / kapat / al / ver / bilgi ( üye / bot )\``), { timeout: 15000, react: true });

        if(['al'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let reason = args.slice(2).join(' ');

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye veya rol belirtmelisin!`), { timeout: 8000, react: true });
            if(!user && !role) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye veya rol belirtmelisin!`), { timeout: 8000, react: true });

            if(user) {

                if(!user.hasPermission(8)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye yönetici yetkisine sahip değil!`), { timeout: 8000, react: true });
                if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyenin yönetici yetkisini alamıyorum!`), { timeout: 8000, react: true });

                let roles = user.roles.cache.filter(role => role.permissions.has(8) && ((role.members.size == 1 && role.members.first().user.bot && role.position < message.guild.members.cache.get(client.user.id).roles.highest.position) || role.editable));

                if(roles.size == 0 && !user.user.bot) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyenin yönetici yetkisini alamıyorum!`), { timeout: 8000, react: true });

                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${user.toString()} isimli ${user.user.bot ? `botun` : `üyenin`} yönetici yetkisi ${reason ? `\`${reason}\` nedeniyle` : ``} **alınıyor** ${loading ? loading : ``} `)).then(async msg => {

                    let index = 0;
                    await new Promise(async (resolve) => {

                        await roles.forEach(async role => {

                            index += 1;
                            await client.wait(index * 400);
                            await administrators.findOneAndUpdate({ guildID: message.guild.id, userID: user.id, reason: !reason ? 'Belirtilmedi!' : reason, type: user.user.bot ? 'BOT' : 'MEMBER' }, { $push: { userRoles: role.id } }, { upsert: true });
                            
                            if(user.user.bot) user.roles.remove(role.id).catch(err => role.setPermissions(0));
                            else user.roles.remove(role.id);

                        });

                        await client.wait(roles.size * 1000).then(resolve);
                        msg.edit(Embed.setDescription(`${success ? success : ``} ${user.toString()} isimli ${user.user.bot ? `botun` : `üyenin`} yönetici yetkisi ${reason ? `\`${reason}\` nedeniyle` : ``} **alındı!**`));

                    });

                });
                
            } else if(role) {

                if(role.members.size == 1 && role.members.first().user.bot) return message.channel.error(message, Embed.setDescription(`Public bir rol belirtmelisin!`), { timeout: 8000, react: true });
                if(!role.permissions.has(8)) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol yönetici yetkisine sahip değil!`), { timeout: 8000, react: true });
                if(!role.editable) return message.channel.error(message, Embed.setDescription(`Belirttiğin rolün yönetici yetkisini alamıyorum!`), { timeout: 8000, react: true });

                let members = role.members;
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${role.toString()} adlı roldeki üyelerin yönetici yetkisi ${reason ? `\`${reason} nedeniyle\`` : ``} **alınıyor** ${loading ? loading : ``} `)).then(async msg => {

                    let index = 0;
                    await new Promise(async (resolve) => {

                        members.forEach(async member => {

                            await client.wait(index * 400);
                            await administrators.findOneAndUpdate({ guildID: message.guild.id, roleID: role.id, reason: !reason ? 'Belirtilmedi!' : reason, type: "ROLE" }, { $push: { roleMembers: member.user.id } }, { upsert: true });
                            member.roles.remove(role.id);

                        });

                        await client.wait(members.size * 1000).then(resolve);

                    });
                    msg.edit(Embed.setDescription(`${success ? success : ``} ${role.toString()} adlı roldeki üyelerin yönetici yetkisi ${reason ? `\`${reason} nedeniyle\`` : ``} **alındı!** Rolde toplam **${role.members.size}** kişi bulunuyor`));

                });

            };

        } else if(['ver'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let reason = args.slice(2).join(' ');

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye veya rol belirtmelisin!`), { timeout: 8000, react: true });
            if(!user && !role) return message.channel.error(message, Embed.setDescription(`Geçerli bir üye veya rol belirtmelisin!`), { timeout: 8000, react: true });


            if(user) {

                if(user.hasPermission(8)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten yönetici yetkisine sahip!`), { timeout: 8000, react: true });
                if(!user.manageable) return message.channel.error(message, Embed.setDescription(`Belirttiğin üyeye yönetici yetkisi veremiyorum!`), { timeout: 8000, react: true });

                let data = await administrators.findOne({ guildID: message.guild.id, userID: user.id, type: user.user.bot ? 'BOT' : 'MEMBER' });

                if(!data) return message.channel.error(message, Embed.setDescription(`Veritabanında bu üyeye ait bir veri bulunamadı!`), { timeout: 8000, react: true });

                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${user.toString()} isimli ${user.user.bot ? `botun` : `üyenin`} yönetici yetkisi ${reason ? `\`${reason}\` nedeniyle` : ``} **geri veriliyor** ${loading ? loading : ``} `)).then(async msg => {

                    await new Promise(async (resolve) => {

                        await data.userRoles.forEach(async (userRole, index) => {

                            await client.wait(index * 400);
                            userRole = message.guild.roles.cache.get(userRole);

                            if(!userRole) return;
                            if(user.user.bot && userRole.members.size == 1 && userRole.members.first().user.bot) await userRole.setPermissions(8);
                            else {
                                if(!userRole.permissions.has(8)) await userRole.setPermissions(8);
                                await user.roles.add(userRole);
                            };

                        });

                        await client.wait(data.userRoles.length * 1000).then(resolve);
                        await administrators.findOneAndDelete({ guildID: message.guild.id, userID: user.id, type: user.user.bot ? 'BOT' : 'MEMBER' });
                        msg.edit(Embed.setDescription(`${success ? success : ``} ${user.toString()} isimli ${user.user.bot ? `botun` : `üyenin`} yönetici yetkisi ${reason ? `\`${reason}\` nedeniyle` : ``} **geri verildi!**`));

                    });

                });

            } else if(role) {

                if(role.members.size == 1 && role.members.first().user.bot) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, react: true });
                if(!role.editable) return message.channel.error(message, Embed.setDescription(`Belirttiğin rolün yönetici yetkisini alamıyorum!`), { timeout: 8000, react: true });

                let data = await administrators.findOne({ guildID: message.guild.id, roleID: role.id, type: 'ROLE' });

                if(!data) return message.channel.error(message, Embed.setDescription(`Veritabanında bu role ait bir veri bulunamadı!`), { timeout: 8000, react: true });

                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${role.toString()} adlı yönetici rolü ${reason ? `\`${reason}\` nedeniyle` : ``} üyelerine **geri veriliyor** ${loading ? loading : ``} `)).then(async msg => {

                    let index = 0;
                    await new Promise(async (resolve) => {

                        data.roleMembers.forEach(async member => {

                            index += 1;
                            await client.wait(index * 400);
                            member = message.guild.members.cache.get(member);

                            if(!member) return;

                            await member.roles.add(role.id);

                        });

                        if(!role.permissions.has(8)) role.setPermissions(8);

                        await administrators.findOneAndDelete({ guildID: message.guild.id, roleID: role.id, type: 'ROLE' });
                        await client.wait(members.size * 1000).then(resolve);

                    });
                    msg.edit(Embed.setDescription(`${success ? success : ``} ${role.toString()} adlı yönetici rolü ${reason ? `\`${reason}\` nedeniyle` : ``} üyelerine **geri verildi!** Rolde toplam **${role.members.size}** kişi bulunuyor`));

                });

            };

        } else if(['kapat'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let reason = args.slice(2).join(' ');

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici kapat ( <@Rol/ID> / hepsi )\``), { timeout: 15000, react: true });
            if(!role && !['hepsi', 'all'].some(arg => args[1].toLocaleLowerCase() == arg)) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici kapat ( <@Rol/ID> / hepsi )\``), { timeout: 15000, react: true });
            
            if(role) {
            
                if(!role.permissions.has(8)) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol zaten yönetici yetkisine sahip değil!`), { timeout: 8000, react: true });
                
                await new administrators({ guildID: message.guild.id, roleID: role.id, type: "CLOSED-ROLE", reason: !reason ? `Belirtilmedi!` : reason }).save();
                await role.setPermissions(0);
                message.channel.success(message, Embed.setDescription(`${role.toString()} adlı rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **kapatıldı!** Rolde toplam **${role.members.size}** kişi bulunuyor!`), { react: true });

            } else if(['hepsi', 'all'].some(arg => args[1].toLocaleLowerCase() == arg)) {

                let index = 0;
                let members = message.guild.roles.cache.filter(role => role.permissions.has(8) && ((role.members.size == 1 && role.members.first().user.bot && role.position < message.guild.members.cache.get(client.user.id).roles.highest.position && role.members.first().user.id !== client.user.id) || role.editable));
                
                if(members.size == 0) return message.channel.error(message, Embed.setDescription(`Sunucuda yönetici yetkisi kapatıla bilecek herhangi bir rol bulunmuyor!`), { timeout: 8000, react: true });
                
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`Sunucudaki **${members.size}** rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **kapatılıyor** ${loading ? loading : ``} `)).then(async msg => {

                    await new Promise(async (resolve) => {

                        await message.guild.roles.cache.filter(role => role.permissions.has(8) && ((role.members.size == 1 && role.members.first().user.bot && role.position < message.guild.members.cache.get(client.user.id).roles.highest.position && role.members.first().user.id !== client.user.id) || role.editable)).forEach(async role => {

                            index += 1;
                            await client.wait(index * 400);
                            await new administrators({ guildID: message.guild.id, roleID: role.id, type: "CLOSED-ROLE", reason: !reason ? `Belirtilmedi!` : reason }).save();
                            await role.setPermissions(0);

                        });

                        await client.wait(message.guild.roles.cache.filter(role => role.permissions.has(8) && ((role.members.size == 1 && role.members.first().user.bot && role.position < message.guild.members.cache.get(client.user.id).roles.highest.position && role.members.first().user.id !== client.user.id) || role.editable)).size * 1000).then(resolve);

                    });
                    msg.edit(Embed.setDescription(`${success ? success : ``} Sunucudaki **${members.size}** rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **kapatıldı!**`));

                });

            };

        } else if(['aç'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let reason = args.slice(2).join(' ');

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici aç ( <@Rol/ID> / hepsi )\``), { timeout: 15000, react: true });
            if(!role && !['hepsi', 'all'].some(arg => args[1].toLocaleLowerCase() == arg)) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici aç ( <@Rol/ID> / hepsi )\``), { timeout: 15000, react: true });
            
            if(role) {

                if(role.permissions.has(8)) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol zaten yönetici yetkisine sahip!`), { timeout: 8000, react: true });
                let data = await administrators.findOne({ guildID: message.guild.id, roleID: role.id, type: "CLOSED-ROLE" });

                if(!data) return message.channel.error(message, Embed.setDescription(`Veritabanında belirttiğin role ait herhangi bir veri bulunamadı!`), { timeout: 8000, react: true });

                await role.setPermissions(8);
                await administrators.findOneAndDelete({ guildID: message.guild.id, roleID: role.id, type: "CLOSED-ROLE" });
                message.channel.success(message, Embed.setDescription(`${role.toString()} adlı rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **açıldı!** Rolde toplam **${role.members.size}** kişi bulunuyor!`), { react: true });

            } else if(['hepsi', 'all'].some(arg => args[1].toLocaleLowerCase() == arg)) {

                let datas = await administrators.find({ guildID: message.guild.id, type: "CLOSED-ROLE" });

                if(!datas.length) return message.channel.error(message, Embed.setDescription(`Veritabanında yönetici yetkisi kapatılmış herhangi bir rol verisi bulunamadı!`), { timeout: 8000, react: true });

                let size = 0;
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`Sunucudaki **${datas.length}** rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **açılıyor** ${loading ? loading : ``} `)).then(async msg => { 

                    await new Promise(async (resolve) => { 
                        
                        datas.forEach(async (data, index) => {

                            await client.wait(index * 400);
                            let role = message.guild.roles.cache.get(data.roleID);

                            if(!role || role.position >= message.guild.members.cache.get(client.user.id).roles.highest.position) return;

                            size += 1;
                            await role.setPermissions(8);
                            await administrators.findOneAndDelete({ guildID: message.guild.id, roleID: role.id, type: "CLOSED-ROLE" });

                        });
                        await client.wait(datas.length * 1000).then(resolve);
                        msg.edit(Embed.setDescription(`${success ? success : ``} Sunucudaki **${size}** rolün yönetici yetkisi ${message.author.toString()} tarafından ${reason ? `\`${reason}\` nedeniyle` : ``} **açıldı!**`));
                        
                    });


                });

            };

        } else if(['bilgi', 'info'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            if(args[1] && ['bot'].some(arg => args[1].toLocaleLowerCase() == arg)) {

                let roles = message.guild.roles.cache.filter(role => role.permissions.has(8) && role.members.size == 1 && role.members.first().user.bot && !role.editable);
                let description = new Array();
                let index = 0;

                if(roles.size == 0) return message.channel.success(message, Embed.setDescription(`Sunucuda yönetici yetkisine sahip herhangi bir bot rolü bulunmuyor!`), { react: true });
                
                await new Promise(async (resolve) => {

                    roles.forEach(async role => {

                        index += 1;
                        description.push(`**[\`${index}\`]** ${role.toString()} : ${role.members.first().toString()}`);

                    });

                    await client.wait(roles.size * 100).then(resolve);

                });
                message.channel.success(message, Embed.setDescription(`
Sunucuda yönetici yetkisine sahip toplam **${roles.size}** bot rolünün bilgileri :

${description.join('\n')}

Toplam **${roles.size}** yönetici yetkisine sahip bot rolü ve **${message.guild.members.cache.filter(member => member.user.bot && member.hasPermission(8)).size}** yönetici yetkisine sahip bot bulunuyor!
                
                `), { react: true });

            } else if(!args[1] || ['üye'].some(arg => args[1].toLocaleLowerCase() == arg)) {

                let roles = message.guild.roles.cache.filter(role => role.permissions.has(8) && !(role.members.size == 1 && role.members.first().user.bot));
                let description = new Array();
                let index = 0;

                if(roles.size == 0) return message.channel.success(message, Embed.setDescription(`Sunucuda yönetici yetkisine sahip herhangi bir üye rol bulunmuyor!`), { react: true });
                
                await new Promise(async (resolve) => {

                    await roles.forEach(async role => {

                        index += 1;
                        description.push(`**[\`${index}\`]** ${role.toString()} : Role sahip toplam üye **${role.members.size}**`);

                    });
                    await client.wait(roles.size * 100).then(resolve);

                });
                message.channel.success(message, Embed.setDescription(`
Sunucuda yönetici yetkisine sahip toplam **${roles.size}** üye rolünün bilgileri :

${description.join('\n')}

Toplam **${roles.size}** yönetici yetkisine sahip üye rolü ve **${message.guild.members.cache.filter(member => !member.user.bot && member.hasPermission(8)).size}** yönetici yetkisine sahip üye bulunuyor!
                
                `), { react: true });

            } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici bilgi üye / info \``));

        } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}yönetici aç / kapat / al / ver / bilgi ( üye / bot )\``), { timeout: 15000, react: true });

    },
};