const { voiceLog } = global.client.guildSettings.logs;
const { mark, loading, success, changeState } = require('../../configs/emojis.json');

module.exports = {
    name: 'allmove',
    aliases: ['herkesitaşı'],
    category: 'Admin',
    usage: '<#Kanal/ID> <Sebep>',
    permission: 'ADMINISTRATOR',
    guildOnyl: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        let memberChannel = message.member.voice.channel;
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        let reason = args.slice(1).join(' ');

        if(!memberChannel) return message.channel.error(message, Embed.setDescription('Her hangi bir ses kanalında değilsin!'), { timeout: 10000, react: true });
        if(!args[0]) return message.channel.error(message, Embed.setDescription('Üyelerin taşınacağı bir ses kanalı belirtmelisin!'), { timeout: 10000, react: true });
        if(!channel || channel.type !== 'voice') return message.channel.error(message, Embed.setDescription('Üyelerin taşınacağı geçerli bir ses kanalı belirtmelisin!'), { timeout: 10000, react: true });
        if(channel.id == memberChannel.id) return message.channel.error(message, Embed.setDescription('Zaten belirttiğin kanaldasınız!'), { timeout: 10000, react: true });
        if(channel.userLimit !== 0 && memberChannel.members.size > channel.userLimit) return message.channel.error(message, Embed.setDescription('Belirttiğin kanalda, sesteki taşına bilecek üyelerin hepsi için yer yok!'), { timeout: 10000, react: true });

        if(mark) message.react(mark);
        message.channel.send(Embed.setDescription(`${memberChannel.toString()} adlı ses kanalındaki üyeler ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel.toString()} adlı ses kanalına taşınmaya başlandı ${loading ? loading : ``} `)).then(async msg => {

            let memberSize = memberChannel.members.size;
            await new Promise(async (resolve) => {

                let index = 0;
                memberChannel.members.forEach(async member => {

                    index += 1;
                    await client.wait(index * 250);
                    member.voice.setChannel(channel.id);
                    
                    if(voiceLog) {

                        let vLog = message.guild.channels.cache.get(voiceLog);
                        
                        if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${member.displayName}\` üyesi \`${message.member.displayName}\` tarafından ${member.voice.channel.toString()} adlı ses kanalından ${channel.toString()} adlı ses kanalına **taşındı!**`);
        
                    };

                });
                await client.wait(memberSize * 250).then(resolve);

            });

            msg.edit(Embed.setDescription(`${success ? success : ``} ${memberChannel.toString()} adlı ses kanalındaki **${memberSize}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel.toString()} adlı ses kanalına **taşındı!**`));

        });

    },
};