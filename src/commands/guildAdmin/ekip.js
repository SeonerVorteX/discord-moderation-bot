const { guildTags, guildTeams, staffRoles, botYt } = global.client.guildSettings;
const { Prefix } = global.client.settings;
const { crown2 } = require('../../configs/emojis.json');

module.exports = {
	name: 'ekip',
	aliases: [],
	category: 'Admin',
	usage: '[<Ekip Numarası> / liste]',
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

		if(!guildTeams || !guildTeams.length) return message.channel.error(message, Embed.setDescription('Bu sunucuda herhangi bir ekip ayarlanmamış. Lütfen botun yapımcısıyla iletişime geçin!'), { timeout: 15000, react: true });

		if(!args[0]) return message.channel.error(message, Embed.setDescription(`Bir ekip ismi veya numarası belirtmelisin. Tüm ekipleri görmek için : \`${Prefix}ekip liste\``), { timeout: 8000, react: true });

		if(['liste', 'tüm', 'hepsi', 'all', 'list'].some(arg => arg == args[0])) {

			await new Promise(async (resolve) => {

				for (let i = 0; i < guildTeams.length; i++) {

					const team = guildTeams[i];
					const teamRole = message.guild.roles.cache.get(team);

					if(!teamRole) continue;

					await client.wait(i * 300);
					const onlineMembers = teamRole.members.filter(member => member.user.presence.status !== 'offline');
					const tagMembers = teamRole.members.filter(member => guildTags.some(tag => member.user.username.includes(tag)));
					const staffMembers = teamRole.members.filter(member => staffRoles.some(role => member.roles.cache.has(role)) || member.roles.cache.has(botYt));
					const voiceMembers = teamRole.members.filter(member => member.voice.channel);

					Embed.addField(`${teamRole.name} `, `
${crown2 ? crown2 : ''}  Toplam Üye : **${teamRole.members.size}**
${crown2 ? crown2 : ''}  Aktif Üye : **${onlineMembers.size}**
${crown2 ? crown2 : ''}  Taglı Üye : **${tagMembers.size}**
${crown2 ? crown2 : ''}  Sesli Üye : **${voiceMembers.size}**
${crown2 ? crown2 : ''}  Yetkili Üye : **${staffMembers.size}**
                    `, true);

				}

				await client.wait(guildTeams.length * 300).then(() => resolve());

			});

			message.channel.success(message, Embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription('').setColor('YELLOW'), { react: true });

		}
		else {

			const team = args[0];
			const teamRole = message.guild.roles.cache.get(guildTeams[team - 1]) || message.guild.roles.cache.find(role => role.name.trim() == args.slice(0).join(' ').trim()) || message.guild.roles.cache.get(team);
			const onlineMembers = teamRole.members.filter(member => member.user.presence.status !== 'offline');
			const tagMembers = teamRole.members.filter(member => guildTags.some(tag => member.user.username.includes(tag)));
			const staffMembers = teamRole.members.filter(member => staffRoles.some(role => member.roles.cache.has(role)) || member.roles.cache.has(botYt));
			const voiceMembers = teamRole.members.filter(member => member.voice.channel);

			message.channel.success(message, Embed.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setDescription(`
${teamRole.toString()} ekibinin sunucu bilgileri :

${crown2 ? crown2 : ''}  Ekipteki Toplam Üye : **${teamRole.members.size}**
${crown2 ? crown2 : ''}  Ekipteki Aktif Üye : **${onlineMembers.size}**
${crown2 ? crown2 : ''}  Ekipteki Taglı Üye : **${tagMembers.size}**
${crown2 ? crown2 : ''}  Ekipteki Sesli Üye : **${voiceMembers.size}**
${crown2 ? crown2 : ''}  Ekipteki Yetkili Üye : **${staffMembers.size}**
            `).setColor('YELLOW'), { react: true });

		}

	},
};