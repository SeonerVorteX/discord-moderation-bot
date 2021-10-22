module.exports = {
    name: 'help',
    aliases: ['yardım', 'komutlar'],
    staff: true,
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    execute(client, message, args, Embed) {

        Embed.setDescription(`
**Admin Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Admin').map(command => `${client.settings.Prefix}${command.name}${!command.usage ? `` : ` ${command.usage}`}`).join(`\n`)}\`

**Ceza Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Ceza').map(command => `${client.settings.Prefix}${command.name}${!command.usage ? `` : ` ${command.usage}`}`).join(`\n`)}\`

**Yetkili Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Yetkili').map(command => `${client.settings.Prefix}${command.name}${!command.usage ? `` : ` ${command.usage}`}`).join(`\n`)}\`

**Bilgi Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Bilgi').map(command => `${client.settings.Prefix}${command.name}${!command.usage ? `` : ` ${command.usage}`}`).join(`\n`)}\`

**Kullanıcı Komutları**
\`${client.commands.filter(command => command.category && command.category == 'Kullanıcı').map(command => `${client.settings.Prefix}${command.name}${!command.usage ? `` : ` ${command.usage}`}`).join(`\n`)}\`
        `);

        message.channel.success(message, Embed.setFooter(`${client.settings.Footer} • ${message.author.username} tarafından istendi`), { react: true });

    },
};