const { Owners, OtherBots } = global.client.settings;
const { unAuthorizedMessages, transporterSpears, botYt, logs } = global.client.guildSettings;
const { voiceLog } = logs;
const { leaved } = require('../../configs/emojis.json');

module.exports = {
    name: 'kes',
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

        if(!Owners.includes(message.author.id) && !message.member.hasPermission('MOVE_MEMBERS')  && !message.member.roles.cache.has(botYt) && !transporterSpears.some(spear => message.member.roles.cache.has(spear))) {
            if(unAuthorizedMessages) return message.channel.error(message, `Maalesef, bu komutu kullana bilmek için yeterli yetkiye sahip değilsin!`, { timeout: 10000 });
            else return;
        };

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!args[0]) return message.channel.error(message, `Bir üye ve ya ses kanalı belirtmelisin!`, { timeout: 5000, reply: true, react: true });
        if(!user && !channel) return message.channel.error(message, `Geçerli bir üye ve ya ses kanalı belirtmelisn!`, { timeout: 5000, reply: true, react: true });
        
        if(user) {

            if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 5000, reply: true, react: true });
            if(Owners.includes(user.user.id) || user.roles.highest.position >= message.member.roles.highest.position || user.user.id == client.user.id || (user.user.bot && OtherBots.includes(user.user.id))) return message.channel.error(message, `Kendinle aynı veya daha yüksek yetkide olan birine bu işlemi uygulayamazsın!`);
            if(!user.voice.channel) return message.channel.error(message, `Belirttiğin kullanıcı bir ses kanalında değil!`, { timeout: 5000, reply: true, react: true });

            if(voiceLog) {

                let vLog = message.guild.channels.cache.get(voiceLog);
                
                if(vLog && vLog.type == 'text') vLog.send(`${leaved ? leaved : ``} \`${user.displayName}\` üyesinin ${user.voice.channel.toString()} adlı ses kanalındaki bağlantısı \`${message.member.displayName}\` tarafından **kesildi!**`);

            };

            message.channel.success(message, Embed.setDescription(`${user.toString()} isimli kullanıcının ${user.voice.channel.toString()} adlı ses kanalındaki bağlantısı ${!reason ? '' : `**${reason}** nedeniyle`} başarıyla kesildi!`), { react: true });
            await user.voice.kick();

        };

        if(channel) {

            if(channel.type !== 'voice') return message.channel.error(message, `Belirttiğin kanal bir ses kanalı değil!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.hasPermission(8) && member.user.id == client.user.id).size == 0 && channel.members.filter(member =>  member.user.bot && !OtherBots.includes(member.user.id)).size == 0) return message.channel.error(message, `Belirttiğin kanalda bağlantısı kesile bilecek herhangi bir üye bulunmuyor!`, { timeout: 5000, reply: true, react: true });
            if(channel.members.filter(member => member.roles.highest.position < message.member.roles.highest.position).size == 0) return message.channel.error(message, `Belirttiğin kanalda bağlantısı kesile bilecek herhangi bir üye bulunmuyor`, { timeout: 5000, reply: true, react: true });

            let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && ((member.hasPermission(8) && member.user.bot && !OtherBots.includes(member.user.id)) && member.user.id !== client.user.id || !member.hasPermission(8))).size;
            message.channel.success(message, Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${totalMembers}** üyenin bağlantısı ${!reason ? '' : `\`${reason}\` nedeniyle`} kesildi!`), { react: true });
            let index = 0;
            channel.members.filter(member => !Owners.includes(member.user.id) && ((member.hasPermission(8) && member.user.bot && !OtherBots.includes(member.user.id)) && member.user.id !== client.user.id || !member.hasPermission(8))).forEach(async member => {

                if(voiceLog) {

                    let vLog = message.guild.channels.cache.get(voiceLog);
                    
                    if(vLog && vLog.type == 'text') vLog.send(`${leaved ? leaved : ``} \`${member.displayName}\` üyesinin ${member.voice.channel.toString()} adlı ses kanalındaki bağlantısı \`${message.member.displayName}\` tarafından **kesildi!**`);
    
                };

                index += 1;
                await client.wait(index * 300);
                await member.voice.kick();

            });
        };

    },
};