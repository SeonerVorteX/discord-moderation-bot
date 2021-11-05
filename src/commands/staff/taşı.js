const { Owners, OtherBots } = global.client.settings;
const { unAuthorizedMessages, transporterSpears, botYt, logs } = global.client.guildSettings;
const { voiceLog } = logs;
const { mark, loading, success, changeState } = require('../../configs/emojis.json');

module.exports = {
    name: 'taşı',
    aliases: [],
    category: 'Yetkili',
    usage: '[<@Üye/ID> / <#Kanal/ID>] <#Kanal/ID>',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        if(!message.member.hasPermission('MOVE_MEMBERS') && !Owners.includes(message.author.id) && !message.member.roles.cache.has(botYt) && !transporterSpears.some(spear => message.member.roles.cache.has(spear))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        let channel2 = message.mentions.channels.array()[1] || message.guild.channels.cache.get(args[1]);
        let reason = args.slice(2).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye ve ya ses kanalı belirtmelisin!`, { timeout: 5000, reply: true, react: true });
        if(!user && !channel) return message.channel.error(message, `Geçerli bir üye ve ya ses kanalı belirtmelisin!`, { timeout: 5000, reply: true, react: true });
        
        if(user) {

            if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 5000, reply: true, react: true });
            if(Owners.includes(user.user.id) || user.roles.highest.position >= message.member.roles.highest.position || user.user.id == client.user.id || (user.user.bot && OtherBots.includes(user.user.id))) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`);
            if(!user.voice.channel) return message.channel.error(message, `Belirttiğin kullanıcı bir ses kanalında değil!`, { timeout: 5000, reply: true, react: true });
            if(!channel2) return message.channel.error(message, `Belirttiğin üyenin taşınacağı ses kanalını belirtmelisin!`, { timeout: 5000, reply: true, react: true });
            if(user.voice.channel.id == channel2.id) return message.channel.error(message, `Belittiğin üye zaten belirtilen ses kanalında!`, { timeout: 5000, reply: true, react: true });

            if(voiceLog) {

                let vLog = message.guild.channels.cache.get(voiceLog);
                
                if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${user.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${user.voice.channel.toString()} adlı ses kanalından ${channel2.toString()} adlı ses kanalına **taşındı!**`);

            };

            message.channel.success(message, Embed.setDescription(`${user.toString()} isimli kullanıcı ${user.voice.channel.toString()} adlı ses kanalından ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel2.toString()} adlı ses kanalına **taşındı!**`), { react: true });
            await user.voice.setChannel(channel2.id);

        };

        if(channel) {

            if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8) && member.user.id == client.user.id).size == 0 && channel.members.filter(member =>  member.user.bot && !OtherBots.includes(member.user.id)).size == 0) return message.channel.error(message, `Belirttiğin kanalda taşına bilecek herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => member.roles.highest.position < message.member.roles.highest.position).size == 0) return message.channel.error(message, `Belirttiğin kanalda taşına bilecek herhangi bir üye bulunmuyor`, { timeout: 5000, reply: true, react: true });
            if(!channel2) return message.channel.error(message, `Belirttiğin kanaldaki üyelerin taşınacağı ses kanalını belirtmelisin!`, { timeout: 5000, reply: true, react: true });
            if(channel2.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 5000, reply: true, react: true });
            if(channel.id == channel2.id) return message.channel.error(message, `Belittiğin kanaldaki üyeler zaten belirtilen ses kanalında!`, { timeout: 5000, reply: true, react: true });

            let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && ((member.hasPermission(8) && member.user.bot && !OtherBots.includes(member.user.id)) && member.user.id !== client.user.id || !member.hasPermission(8))).size;
            let index = 0;
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel2.toString()} adlı ses kanalına **taşınıyor** ${loading ? loading : ``} `)).then(async msg => {

                await new Promise(async (resolve) => {

                    channel.members.filter(member => !Owners.includes(member.user.id) && ((member.hasPermission(8) && member.user.bot && !OtherBots.includes(member.user.id)) && member.user.id !== client.user.id || !member.hasPermission(8))).forEach(async member => {

                        if(voiceLog) {

                            let vLog = message.guild.channels.cache.get(voiceLog);
                            
                            if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalından ${channel2.toString()} adlı ses kanalına **taşındı!**`);
            
                        };
                        
                        index += 1;
                        await client.wait(index * 500);
                        await member.voice.setChannel(channel2.id);

                    });

                    await client.wait(channel.members.filter(member => !Owners.includes(member.user.id) && ((member.hasPermission(8) && member.user.bot && !OtherBots.includes(member.user.id)) && member.user.id !== client.user.id || !member.hasPermission(8))).size * 500).then(resolve)

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel2.toString()} adlı ses kanalına **taşındı!**`), { react: true });

            });

        };

    },
};