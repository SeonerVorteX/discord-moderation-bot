const { Prefix } = global.client.settings;
const { meetRole, meetChannel } = global.client.guildSettings;
const { mark, loading, success } = require('../../configs/emojis.json');
const roleLog = require('../../schemas/roleLog.js');

module.exports = {
    name: 'katıldı', 
    aliases: ['toplantıkatıldı'],
    category: 'Admin',
    usage: '[ver / al]',
    permission: 'ADMINISTRATOR',
    guildOnly: true,
    cooldown: 3,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {

        if(!args[0]) return message.channel.error(message, Embed.setDescription(`${mark ? mark : ``}  Doğru kullanım : \`${Prefix}katıldı ver / al\``));

        if(['ver', 'dağıt'].some(arg => args[0].toLowerCase() == arg)) {

            if(!meetRole || !message.guild.roles.cache.has(meetRole)) return message.channel.error(message, Embed.setDescription(`Katıldı rolü ayarlanmamış. Lütfen botun yapımcısıyla iletişime geçin!`), { timeout: 8000, react: true });
            if(message.guild.roles.cache.get(meetRole).position >= message.guild.members.cache.get(client.user.id).roles.highest.position) return message.channel.error(message, Embed.setDescription(`Katıldı rolü sahip olduğum en yüksek rolle aynı veya yüksek bir rolde olduğu için işlem yapamam!`), { timeout: 8000, react: true });
            if(!message.member.voice.channel || (meetChannel && message.member.voice.channel.id !== meetChannel)) return message.channel.error(message, Embed.setDescription(`Toplantı kanalında olman gerekiyor!`), { timeout: 8000, react: true });

            if(mark) message.react(mark)
            let members = message.guild.members.cache.filter(member => member.roles.cache.has(meetRole) && (!member.voice.channel || member.voice.channel.id !== message.member.voice.channel.id));
            message.channel.send(Embed.setDescription(`Toplantı kanalında bulunan üyelere ${message.guild.roles.cache.get(meetRole).toString()} rolü **verilmeye** başlandı ${loading ? loading : ''}`)).then(async msg => {

                await new Promise(async (resolve) => {

                    let index = 0;
                    message.member.voice.channel.members.forEach(async member => {
    
                        index += 1;
                        await client.wait(index * 300);
                        await member.roles.add(meetRole);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: meetRole, date: Date.now(), type: 'ROLE-ADD' }).save();
    
                    });
                    let index2 = 0;
                    message.guild.members.cache.filter(member => member.roles.cache.has(meetRole) && (!member.voice.channel || member.voice.channel.id !== message.member.voice.channel.id)).forEach(async member => {

                        index2 += 1;
                        await client.wait(index * 300);
                        await member.roles.remove(meetRole);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: meetRole, date: Date.now(), type: 'ROLE-REMOVE' }).save();

                    });
                    await client.wait(message.member.voice.channel.members.size * 300).then(resolve);

                });

                msg.edit(Embed.setDescription(`${success ? success : ``} Toplantı kanalında bulunan bütün üyelere ${message.guild.roles.cache.get(meetRole).toString()} rolü **verildi** ${members.size ? `ve toplantıya gelmeyen **${members.size}** üyeden rol alındı` : ``}`));

            });

        } else if(['al'].some(arg => args[0].toLowerCase() == arg)) {

            if(mark) message.react(mark)
            let members = message.guild.members.cache.filter(member => member.roles.cache.has(meetRole));
            message.channel.send(Embed.setDescription(`**${members.size}** üyeden ${message.guild.roles.cache.get(meetRole).toString()} rolü **alınmaya** başlandı ${loading ? loading : ''}`)).then(async msg => {

                await new Promise(async (resolve) => {

                    let index = 0;
                    members.forEach(async member => {
    
                        index += 1;
                        await client.wait(index * 300);
                        await member.roles.remove(meetRole);
                        await new roleLog({ guildID: message.guild.id, staffID: message.author.id, userID: member.id, roleID: meetRole, date: Date.now(), type: 'ROLE-REMOVE' }).save();
    
                    });
                    await client.wait(message.member.voice.channel.members.size * 300).then(resolve);

                });

                msg.edit(Embed.setDescription(` ${success ? success : ``} **${members.size}** üyeden ${message.guild.roles.cache.get(meetRole).toString()} rolü **alındı!**`));

            });

        };

    },
};