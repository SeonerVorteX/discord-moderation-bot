const { staffRoles, transporterSpears, registerSpears, botYt } = global.client.guildSettings;

module.exports = {
    name: 'yetkilisay',
    aliases: ['ytsay', 'yetkisay'],
    category: 'Admin',
    usage: '<Dm>',
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

        let members = message.guild.members.cache.filter(member => !member.user.bot && (staffRoles.some(role => member.roles.cache.has(role)) || transporterSpears.some(role => member.roles.cache.has(role)) || registerSpears.some(role => member.roles.cache.has(role)) || member.roles.cache.has(botYt) || member.hasPermission('MANAGE_ROLES')) && member.user.presence.status !== 'offline');
        
        if(args[0] && ['dm'].some(arg => args[0] == arg)) {
            
            message.channel.true(message, `Aktif olup seste bulunmayan **${members.size}** yetkili bulunuyor. Yetkililerin listesi :\n\n${members.map(member => member.toString()).join(`\n`)}\n\n**Yetkililere DM aracılığıyla haber verilmeye başlanıldı!**`);
            members.forEach(async (member, index) => {

                client.wait(index * 1000);
                member.send(`Merhabalar, sunucumuzun ses aktifliğini arttırmak için lütfen müsaitsen public odalara değilsen özel odalara geçebilirmisin?`).catch(err => message.channel.send(`${member.toString()} adlı yetkiliye DM aracılığıyla ulaşamadım. Müsaitsen public odalara değilsen özel odalara geçebilirmisin?`));

            });

        } else if(args[0] || !args[0]) {

            message.channel.true(message, `Aktif olup seste bulunmayan **${members.size}** yetkili bulunuyor. Yetkililerin listesi :\n\n${members.map(member => member.toString()).join(`\n`)}`);

        };

    },
};