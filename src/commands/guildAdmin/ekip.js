const { guildTags, guildTeams, staffRoles, botYt } = global.client.guildSettings;
const { Prefix } = global.client.settings;
const { crown2 } = require('../../configs/emojis.json');

module.exports = {
    name: 'ekip',
    aliases: [],
    category: 'Admin',
    usage: '<Ekip Numarası> / liste',
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

        if(!guildTeams || !guildTeams.length) return message.channel.error(message, `Bu sunucuda herhangi bir ekip ayarlanmamış. Lütfen botun yapımcısıyla iletişime geçin!`, { timeout: 8000, react: true });

        if(!args[0]) return message.channel.error(message, `Bir ekip ismi veya numarası belirtmelisin. Tüm ekipleri görmek için : \`${Prefix}ekip liste\``, { timeout: 8000, reply: true, react: true });

        if(['liste', 'tüm', 'hepsi', 'all', 'list'].some(arg => arg == args[0])) {

            for (let i = 0; i < guildTeams.length; i++) {

                let team = guildTeams[i];
                let teamRole = message.guild.roles.cache.get(team)

                if(!teamRole) continue;

                client.wait(i+1 * 250);
                let onlineMembers = teamRole.members.filter(member => member.user.presence.status !== 'offline');
                let tagMembers = teamRole.members.filter(member => guildTags.some(tag => member.user.username.includes(tag)));
                let staffMembers = teamRole.members.filter(member => staffRoles.some(role => member.roles.cache.has(role)) || member.roles.cache.has(botYt));
                let voiceMembers = teamRole.members.filter(member => member.voice.channel);

                Embed.addField(`${teamRole.name} `, `
${crown2} Toplam Üye : **${teamRole.members.size}**
${crown2} Aktif Üye : **${onlineMembers.size}**
${crown2} Taglı Üye : **${tagMembers.size}**
${crown2} Sesli Üye : **${voiceMembers.size}**
${crown2} Yetkili Üye : **${staffMembers.size}**
                `, true);

            };

            message.channel.true(message, Embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription('').setColor('YELLOW'), { react: true });

        } else {

            let team = args[1]
            let teamRole = message.guild.roles.cache.get(guildTeams[team-1]) || message.guild.roles.cache.find(role => role.name.trim() == args.slice(0).join(' ').trim());
            let onlineMembers = teamRole.members.filter(member => member.user.presence.status !== 'offline');
            let tagMembers = teamRole.members.filter(member => guildTags.some(tag => member.user.username.includes(tag)));
            let staffMembers = teamRole.members.filter(member => staffRoles.some(role => member.roles.cache.has(role)) || member.roles.cache.has(botYt));
            let voiceMembers = teamRole.members.filter(member => member.voice.channel);

            message.channel.true(message, Embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription(`
${teamRole.toString()} ekibinin sunucu bilgileri :

${crown2} Ekipteki Toplam Üye : **${teamRole.members.size}**
${crown2} Ekipteki Aktif Üye : **${onlineMembers.size}**
${crown2} Ekipteki Taglı Üye : **${tagMembers.size}**
${crown2} Ekipteki Sesli Üye : **${voiceMembers.size}**
${crown2} Ekipteki Yetkili Üye : **${staffMembers.size}**
            `).setColor('YELLOW'), { react: true });

        };

    },
};