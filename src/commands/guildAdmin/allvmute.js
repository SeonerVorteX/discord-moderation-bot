const { Owners } = global.client.settings;
const { botYt } = global.client.guildSettings;
const { voiceLog } = global.client.guildSettings.logs;
const { mark, loading, success, muted } = require('../../configs/emojis.json');

module.exports = {
    name: 'allvmute',
    aliases: ['allmute'],
    category: 'Admin',
    usage: '<#Kanal/ID> <Sebep>',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    execute(client, message, args, Embed) {

        let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;

        if(!channel) return message.channel.error(message, Embed.setDescription(`Bir ses kanalında olmalı ve ya kanal ID'si girmelisin!`), { timeout: 10000, react: true });
 
        if(!message.member.voice.channel && args[0]) {

            if(!message.guild.channels.cache.get(args[0]) || (message.mentions.channels.first() && message.mentions.channels.first().type !== 'voice')) return message.channel.error(message, Embed.setDescription(`Geçerli bir ses kanalı belirtmelisin`), { timeout: 10000, react: true });
            if(channel.members.size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin kanalda herhangi bir üye bulunmuyor!`), { timeout: 10000, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin ses kanalında susturula bilecek herhangi bir üye yok veya hepsi zaten susturulmuş!`), { timeout: 10000, react: true });

            let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
            let reason = args.slice(1).join(' ');
            let index = 0;
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki üyeler ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturulmaya** başlandı ${loading ? loading : ``} `)).then(async msg => {

                await new Promise(async (resolve) => {

                    channel.members.filter(member => !member.voice.serverMute).forEach(async member=> {

                        index += 1;
                        await client.wait(index * 300);
                        member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından susturulması istendi` : reason});

                        if(voiceLog) {

                            let vLog = message.guild.channels.cache.get(voiceLog);

                            if(vLog && vLog.type == 'text') vLog.send(`${muted ? muted : ``} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalında **susturuldu!**`)

                        };

                    });

                    await client.wait(totalMembers * 1000).then(resolve);
                    msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturuldu!**`));

                });

            });
            
        } else if(message.member.voice.channel) {

            if(!args[0] || !message.guild.channels.cache.get(args[0])) {

                channel = message.member.voice.channel;

                if(channel.members.size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin kanalda herhangi bir üye bulunmuyor!`), { timeout: 10000, react: true })
                if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, Embed.setDescription(`Bulunduğun ses kanalında susturula bilecek herhangi bir üye yok veya hepsi zaten susturulmuş!`), { timeout: 10000, react: true });

                let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
                let index = 0;
                let reason;
                if(args[0]) reason = args.slice(0).join(' ');
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki üyeler ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturulmaya** başlandı ${loading ? loading : ``} `)).then(async msg => {

                    await new Promise(async (resolve) => {

                        channel.members.filter(member => !member.voice.serverMute).forEach(async member=> {

                            index += 1;
                            await client.wait(index * 300);
                            member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından susturulması istendi` : reason});

                            if(voiceLog) {

                                let vLog = message.guild.channels.cache.get(voiceLog);

                                if(vLog && vLog.type == 'text') vLog.send(`${muted ? muted : ``} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalında **susturuldu!**`)

                            };

                        });

                        await client.wait(totalMembers * 1000).then(resolve);
                        msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturuldu!**`));

                    });

                });

            } else if(args[0] && message.guild.channels.cache.get(args[0]) && channel.type == 'voice') {

                channel = message.guild.channels.cache.get(args[0]);

                if(channel.members.size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin kanalda herhangi bir üye bulunmuyor!`), { timeout: 10000, react: true })
                if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, Embed.setDescription(`Belirttiğin ses kanalında susturula bilecek herhangi bir üye yok veya hepsi zaten susturulmuş!`), { timeout: 10000, react: true });

                let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
                let index = 0;
                let reason;
                if(args[1]) reason = args.slice(1).join(' ');
                if(mark) message.react(mark);
                message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki üyeler ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturulmaya** başlandı ${loading ? loading : ``} `)).then(async msg => {

                    await new Promise(async (resolve) => {

                        channel.members.filter(member => !member.voice.serverMute).forEach(async member=> {

                            index += 1;
                            await client.wait(index * 300);
                            member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından susturulması istendi` : reason});

                            if(voiceLog) {

                                let vLog = message.guild.channels.cache.get(voiceLog);

                                if(vLog && vLog.type == 'text') vLog.send(`${muted ? muted : ``} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalında **susturuldu!**`)

                            };

                        });

                        await client.wait(totalMembers * 1000).then(resolve);
                        msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} **susturuldu!**`));

                    });

                });

            };

        };
    },
};