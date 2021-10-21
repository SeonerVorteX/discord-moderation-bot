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

        if(!memberChannel) return message.channel.error(message, 'Her hangi bir ses kanalında değilsin!', { timeout: 10000, reply: true, react: true });
        if(!args[0]) return message.channel.error(message, 'Üyelerin taşınacağı bir ses kanalı belirtmelisin!', { timeout: 10000, reply: true, react: true });
        if(!channel || channel.type !== 'voice') return message.channel.error(message, 'Üyelerin taşınacağı geçerli bir ses kanalı belirtmelisin!', { timeout: 10000, reply: true, react: true });
        if(channel.id == memberChannel.id) return message.channel.error(message, 'Zaten belirttiğin kanaldasınız!', { timeout: 10000, reply: true, react: true });
        if(channel.userLimit !== 0 && memberChannel.members.size > channel.userLimit) return message.channel.error(message, 'Belirttiğin kanalda, sesteki taşına bilecek üyelerin hepsi için yer yok!', { timeout: 10000, reply: true, react: true });

        memberChannel.members.forEach((member, index) => {

            client.wait(index * 1200);
            member.voice.setChannel(channel.id);

        });

        message.channel.true(message, Embed.setDescription(`${memberChannel.toString()} adlı ses kanalındaki **${memberChannel.members.size}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} ${channel.toString()} adlı ses kanalına taşındı`), { react: true });

    },
};