const { Owners } = global.client.settings;
const { unAuthorizedMessages, transporterSpears, botYt, logs } = global.client.guildSettings;
const { voiceLog } = logs;
const { mark, loading, success, changeState} = require('../../configs/emojis.json');

module.exports = {
    name: 'çek',
    aliases: [],
    category: 'Yetkili',
    usage: '[<@Üye/ID> / <#Kanal/ID>] <Sebep>',
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

        if(!message.member.voice.channel) return message.channel.error(message, `Bir ses kanalında olmalısın!`, { timeout: 5000, reply: true, react: true });
        if(!args[0]) return message.channel.error(message, `Bir üye ve ya ses kanalı belirtmelisin!`, { timeout: 5000, reply: true, react: true });
        if(!user && !channel) return message.channel.error(message, `Geçerli bir üye ve ya ses kanalı belirtmelisin!`, { timeout: 5000, reply: true, react: true });
        
        if(user) {

            if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 5000, reply: true, react: true });
            if(message.member.roles.highest.position <= user.roles.highest.position) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`);
            if(!user.voice.channel) return message.channel.error(message, `Belirttiğin kullanıcı bir ses kanalında değil!`, { timeout: 5000, reply: true, react: true });
            if(user.voice.channel == message.member.voice.channel) return message.channel.error(message, `Belittiğin üye ile zaten aynı ses kanalındasın!`, { timeout: 5000, reply: true, react: true });

            if(voiceLog) {

                let vLog = message.guild.channels.cache.get(voiceLog);
                
                if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${user.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${user.voice.channel.toString()} adlı ses kanalından ${message.member.voice.channel.toString()} adlı ses kanalına **çekildi!**`);

            };

            await user.voice.setChannel(message.member.voice.channel);
            message.channel.success(message, Embed.setDescription(`${user.toString()} isimli kullanıcı bulunduğun ( \`${message.member.voice.channel.name}\` ) ses kanalına **çekildi!**`), { react: true });

        };

        if(channel) {

            if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(member.voice.channel.id == channel.id) return message.channel.error(message, `Bulunduğun ses kanalıyla belirttiğin ses kanalı aynı!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).size == 0) return message.channel.error(message, `Belirttiğin kanalda çekile bilecek herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => member.roles.highest.position < message.member.roles.highest.position).size == 0) return message.channel.error(message, `Belirttiğin kanalda çekile bilecek herhangi bir üye bulunmuyor`, { timeout: 5000, reply: true, react: true });

            let reason = args.slice(1).join(' ');
            let index = 0;
            if(mark) message.react(mark);
            message.channel.send(Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).size}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${message.member.voice.channel.toString()} adlı ses kanalına **çekiliyor** ${loading ? loading : ``} `)).then(async msg => {

                await new Promise(async (resolve) => {

                    channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).forEach(async member => {

                        if(voiceLog) {

                            let vLog = message.guild.channels.cache.get(voiceLog);
                            
                            if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalından ${message.member.voice.channel.toString()} adlı ses kanalına **çekildi!**`);
            
                        };
                        
                        index += 1;
                        await client.wait(index * 300);
                        await member.voice.setChannel(message.member.voice.channel.id);

                    });

                    await client.wait(channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)) * 300).then(resolve);

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} ${channel.toString()} adlı ses kanalındaki **${channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).size}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${message.member.voice.channel.toString()} adlı ses kanalına **çekildi!**`))

            });

        };
        
    },
};