const { Owners, Prefix } = global.client.settings;
const { botYt } = global.client.guildSettings;
const { mark, success, loading } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'rol',
    aliases: ['role'],
    category: 'Yetkili',
    usage: '[ver / al] [<@Üye/ID> / <@Rol/ID> / <#Kanal/ID>] <Rol İsmi/ID>',
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

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}rol [ver / al] [<@Üye/ID> / <@Rol/ID> / <#Kanal/ID>] <Rol İsmi/ID>\``), { timeout: 10000, react: true });

        if(['ver'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let publicRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            let role = message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name == args.slice(2).join(' '));

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye, rol veya ses kanalı belirtmelisin!`), { timeout: 8000, react: true });
            if(!user && !publicRole && !channel) return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}rol ver [<@Üye/ID> / <@Rol/ID> / <#Kanal/ID>] <Rol İsmi/ID>\``), { timeout: 10000, react: true });
            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Verilecek rolü belirtmelisin!`), { timeout: 8000, react: true });
            if(!role) return message.channel.error(message, Embed.setDescription(`Geçerli bir rol belirtmelisin!`), { timeout: 8000, react: true });
            if(role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, react: true });
            if(role.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol sahip olduğun en yüksek veya daha yüksek bir yetkide olduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
            
            if(user) {

                if(user.roles.cache.has(role.id)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten belirttiğin role sahip!`), { timeout: 8000, react: true });

                await user.roles.add(role.id);
                await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role.id, date: Date.now(), type: 'ROLE-ADD' }).save();

                return message.channel.success(message, Embed.setDescription(`${success ? success : ``} ${user.toString()} adlı üyeye başarıyla ${role.toString()} rolü **verildi!**`), { react: true });

            } else if(publicRole) {

                let members = publicRole.members.filter(member => !member.roles.cache.has(role.id));
                let size = members.size;
                let index = 0;

                if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Maalesef, bu işlemi sadece \`Yönetici\` yetkisine sahip yetkililer yapabilir!`), { timeout: 15000, react: true });
                if(!publicRole.members.size) return message.channel.error(message, Embed.setDescription(`Belirtilen rolde herhangi bir üye bulunmuyor!`), { timeout: 8000, react: true });
                if(!size) return message.channel.error(message, Embed.setDescription(`Belirtilen roldeki üyelerin hepsi zaten belirtilen role sahip!`), { timeout: 8000, react: true });
                
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${publicRole.toString()} rolüne sahip üyelere ${role.toString()} rolü **veriliyor** ${loading ? loading : ``}`)).then(async msg => {

                    await new Promise(async (resolve) => {

                        members.forEach(async member => {

                            index += 1;
                            await client.wait(index * 250);
                            member.roles.add(role.id);
                            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: role.id, date: Date.now(), type: 'ROLE-ADD' }).save();

                        });
                        await client.wait(size * 250).then(resolve);

                    });

                    msg.edit(Embed.setDescription(`${success ? success : ``} ${publicRole.toString()} rolüne sahip **${size}** üyeye ${role.toString()} rolü **verildi!**`));

                });

            } else if(channel) {

                if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Maalesef, bu işlemi sadece \`Yönetici\` yetkisine sahip yetkililer yapabilir!`), { timeout: 15000, react: true });
                if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 8000, react: true });

                let members = channel.members.filter(member => !member.roles.cache.has(role.id));
                let size = members.size;
                let index = 0;

                if(!channel.members.size) return message.channel.error(message, Embed.setDescription(`Belirtilen ses kanalında herhangi bir üye bulunmuyor!`), { timeout: 8000, react: true });
                if(!size) return message.channel.error(message, Embed.setDescription(`Belirtilen ses kanalındaki üyelerin hepsi zaten belirtilen role sahip!`), { timeout: 8000, react: true });
                
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki üyelere ${role.toString()} rolü **veriliyor** ${loading ? loading : ``}`)).then(async msg => {

                    await new Promise(async (resolve) => {

                        members.forEach(async member => {

                            index += 1;
                            await client.wait(index * 250);
                            member.roles.add(role.id);
                            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: role.id, date: Date.now(), type: 'ROLE-ADD' }).save();

                        });
                        await client.wait(size * 250).then(resolve);

                    });

                    msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${size}** üyeye ${role.toString()} rolü **verildi!**`));

                });

            };

        } else if(['al'].some(arg => args[0].toLocaleLowerCase() == arg)) {

            let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            let publicRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            let role = message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(role => role.name == args.slice(2).join(' '));

            if(!args[1]) return message.channel.error(message, Embed.setDescription(`Bir üye, rol veya ses kanalı belirtmelisin!`), { timeout: 8000, react: true });
            if(!user && !publicRole && !channel) return message.channel.error(message, Embed.setDescription(`${mark} Doğru kullanım : \`${Prefix}rol al [<@Üye/ID> / <@Rol/ID> / <#Kanal/ID>] <Rol İsmi/ID>\``), { timeout: 10000, react: true });
            if(!args[2]) return message.channel.error(message, Embed.setDescription(`Alınacak rolü belirtmelisin!`), { timeout: 8000, react: true });
            if(!role) return message.channel.error(message, Embed.setDescription(`Geçerli bir rol belirtmelisin!`), { timeout: 8000, react: true });
            if(role.members.size == 1 && role.members.first().user.bot && !role.editable) return message.channel.error(message, `Public bir rol belirtmelisin!`, { timeout: 8000, react: true });
            if(role.position >= message.member.roles.highest.position) return message.channel.error(message, Embed.setDescription(`Belirttiğin rol sahip olduğun en yüksek veya daha yüksek bir yetkide olduğu için bu işlemi uygulayamazsın!`), { timeout: 8000, react: true });
            
            if(user) {

                if(!user.roles.cache.has(role.id)) return message.channel.error(message, Embed.setDescription(`Belirttiğin üye zaten belirttiğin role sahip değil!`), { timeout: 8000, react: true });

                await user.roles.remove(role.id);
                await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: user.id, roleID: role.id, date: Date.now(), type: 'ROLE-REMOVE' }).save();

                return message.channel.success(message, Embed.setDescription(`${success ? success : ``} ${user.toString()} adlı üyeden ${role.toString()} rolü başarıyla **alındı!**`), { react: true });

            } else if(publicRole) {

                let members = publicRole.members.filter(member => member.roles.cache.has(role.id));
                let size = members.size;
                let index = 0;

                if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Maalesef, bu işlemi sadece \`Yönetici\` yetkisine sahip yetkililer yapabilir!`), { timeout: 15000, react: true });
                if(!publicRole.members.size) return message.channel.error(message, Embed.setDescription(`Belirtilen rolde herhangi bir üye bulunmuyor!`), { timeout: 8000, react: true });
                if(!size) return message.channel.error(message, Embed.setDescription(`Belirtilen roldeki üyelerin hepsi zaten belirtilen role sahip değil!`), { timeout: 8000, react: true });
                
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${publicRole.toString()} rolüne sahip üyelerden ${role.toString()} rolü **alınıyor** ${loading ? loading : ``}`)).then(async msg => {

                    await new Promise(async (resolve) => {

                        members.forEach(async member => {

                            index += 1;
                            await client.wait(index * 250);
                            member.roles.remove(role.id);
                            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: role.id, date: Date.now(), type: 'ROLE-REMOVE' }).save();

                        });
                        await client.wait(size * 250).then(resolve);

                    });

                    msg.edit(Embed.setDescription(`${success ? success : ``} ${publicRole.toString()} rolüne sahip **${size}** üyeden ${role.toString()} rolü **alındı!**`));

                });

            } else if(channel) {

                if(!Owners.includes(message.author.id) && !message.member.hasPermission(8) && !message.member.roles.cache.has(botYt)) return message.channel.error(message, Embed.setDescription(`Maalesef, bu işlemi sadece \`Yönetici\` yetkisine sahip yetkililer yapabilir!`), { timeout: 15000, react: true });
                if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 8000, react: true });

                let members = channel.members.filter(member => member.roles.cache.has(role.id));
                let size = members.size;
                let index = 0;

                if(!channel.members.size) return message.channel.error(message, Embed.setDescription(`Belirtilen ses kanalında herhangi bir üye bulunmuyor!`), { timeout: 8000, react: true });
                if(!size) return message.channel.error(message, Embed.setDescription(`Belirtilen ses kanalındaki üyelerin hepsi zaten belirtilen role sahip değil!`), { timeout: 8000, react: true });
                
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki üyelerden ${role.toString()} rolü **alınıyor** ${loading ? loading : ``}`)).then(async msg => {

                    await new Promise(async (resolve) => {

                        members.forEach(async member => {

                            index += 1;
                            await client.wait(index * 250);
                            member.roles.remove(role.id);
                            await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: role.id, date: Date.now(), type: 'ROLE-REMOVE' }).save();

                        });
                        await client.wait(size * 250).then(resolve);

                    });

                    msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${size}** üyeden ${role.toString()} rolü **alındı!**`));

                });

            };

        } else return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}rol [ver / al] [<@Üye/ID> / <@Rol/ID> / <#Kanal/ID>] <Rol İsmi/ID>\``), { timeout: 10000, react: true });

    },
};