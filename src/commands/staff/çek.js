const { Owners } = global.client.settings;
const { transporterSpears, botYt, logs } = global.client.guildSettings;
const { voiceLog } = logs;
const { changeState } = require('../../configs/emojis.json');

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

        if(!message.member.hasPermission('MOVE_MEMBERS') && !Owners.includes(message.author.id) && !message.member.roles.cache.has(botYt) && !transporterSpears.some(spear => message.member.roles.cache.has(spear))) return;

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
                
                if(vLog && vLog.type == 'text') vLog.send(`${changeState} \`${user.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${user.voice.channel.toString()} adlı ses kanalından ${message.member.voice.channel.toString()} adlı ses kanalına **çekildi!**`);

            };

            await user.voice.setChannel(message.member.voice.channel);
            message.channel.true(message, Embed.setDescription(`${user.toString()} isimli kullanıcı bulunduğun ( \`${message.member.voice.channel.name}\` ) ses kanalına çekildi!`), { react: true });

        };

        if(channel) {

            if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).size == 0) return message.channel.error(message, `Belirttiğin kanalda çekile bilecek herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => member.roles.highest.position < message.member.roles.highest.position).size == 0) return message.channel.error(message, `Belirttiğin kanalda çekile bilecek herhangi bir üye bulunmuyor`, { timeout: 5000, reply: true, react: true });

            message.channel.true(message, Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${channel.members.size}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${member.voice.channel.toString()} adlı ses kanalına çekildi!`), { react: true });
            channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8)).forEach(async (member, index) => {

                if(voiceLog) {

                    let vLog = message.guild.channels.cache.get(voiceLog);
                    
                    if(vLog && vLog.type == 'text') vLog.send(`${changeState} \`${user.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${user.voice.channel.toString()} adlı ses kanalından ${message.member.voice.channel.toString()} adlı ses kanalına **çekildi!**`);
    
                };
                
                client.wait(index * 1200);
                await member.voice.setChannel(message.member.voice.channel.id);

            });
        };
        
    },
};