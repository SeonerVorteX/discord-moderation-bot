const { Owners } = global.client.settings;
const { botYt } = global.client.guildSettings;

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

        if(!channel) return message.channel.error(message, `Bir ses kanalında olmalı ve ya kanal ID'si girmelisin!`, { timeout: 10000, reply: true, react: true });
 
        if(!message.member.voice.channel && args[0]) {

            if(!message.guild.channels.cache.get(args[0]) || (message.mentions.channels.first() && message.mentions.channels.first().type !== 'voice')) return message.channel.error(message, `Geçerli bir ses kanalı belirtmelisin`, { timeout: 10000, reply: true, react: true });
            if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 10000, reply: true, react: true });
            if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, `Belirttiğin ses kanalında susturula bilecek başka bir üye yok`, { timeout: 10000, reply: true, react: true });

            let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
            let reason = args.slice(1).join(' ');
            channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission('ADMINISTRATOR')).forEach((member, index)=> {

                client.wait(index * 1200);
                member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından istendi` : reason});

            });

            message.channel.true(message, Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} susturuldu`), { react: true });

        } else if(message.member.voice.channel) {

            if(!args[0] || !message.guild.channels.cache.get(args[0])) {

                channel = message.member.voice.channel;

                if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 10000, reply: true, react: true })
                if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, `Bulunduğun ses kanalındaki üyelerin hepsi zaten susturulmuş`, { timeout: 10000, reply: true, react: true });

                let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
                let reason;
                if(args[0]) reason = args.slice(0).join(' ');
                channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission('ADMINISTRATOR')).forEach((member, index)=> {

                    client.wait(index * 1200);
                    member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından istendi` : reason});

                });

                message.channel.true(message, Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} susturuldu`), { react: true });

            } else if(args[0] && message.guild.channels.cache.get(args[0]) && channel.type == 'voice') {

                channel = message.guild.channels.cache.get(args[0]);

                if(channel.members.size == 0) return message.channel.error(message, `Belirttiğin kanalda herhangi bir üye bulunmuyor!`, { timeout: 10000, reply: true, react: true })
                if(channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size == 0) return message.channel.error(message, `Belirttiğin ses kanalındaki üyelerin hepsi zaten susturulmuş`, { timeout: 10000, reply: true, react: true });

                let totalMembers = channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission(8) && !member.voice.serverMute).size;
                let reason;
                if(args[1]) reason = args.slice(1).join(' ');
                channel.members.filter(member => !Owners.includes(member.user.id) && !member.roles.cache.has(botYt) && !member.hasPermission('ADMINISTRATOR')).forEach((member, index)=> {

                    client.wait(index * 1200);
                    member.voice.setMute(true, { reason: !reason ? `${message.author.username} tarafından istendi` : reason});

                });

                message.channel.true(message, Embed.setDescription(`${channel.toString()} adlı ses kanalındaki **${totalMembers}** üye ${!reason ? '' : `\`${reason}\` nedeniyle`} susturuldu`), { react: true });

            };

        };
    },
};