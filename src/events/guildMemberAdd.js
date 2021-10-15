const { client } = global;
const { forbidRoles, forbidChannel, forbidLog } = client.guildSettings.forbiddenTag;
const { guildID, penals, logs} = client.guildSettings;
const { jailRoles } = penals.jail;
const { cmuteRoles } = penals.chatMute;
const { vmuteRoles } = penals.voiceMute;
const { securityLog } = logs;
const forbiddenTag = require('../schemas/forbiddenTag.js');
const Penals = require('../schemas/penals.js');
const embed = require('../utils/Embed.js');

/**
 * @param { GuildMember } member
 */

module.exports = async (member) => {

    if(member.user.bot) return;
    if(member.guild.id !== guildID) return;

    let Embed = embed(false, false, false);

    ///Forbidden Tag
    let data = await forbiddenTag.findOne({ guildID: member.guild.id });

    if(data && data.forbiddenTags.length && data.forbiddenTags.some(tag => member.user.username.includes(tag))) {

        await client.wait(2000).then(() => {

            if(member.manageable) member.roles.set(forbidRoles);
            let tag = data.forbiddenTags.find(tag => member.user.username.includes(tag));
            member.guild.channels.cache.get(forbidChannel).send(`${member.toString()} sunucumuza hoş geldin. Maalesef kullanıcı adın sunucumuzdaki yasaklı taglardan birini ( \`${tag}\` ) içeriyor. Bu sebeple sunucuya erişemezsin!`);
            member.guild.channels.cache.get(forbidLog).send(`\`${member.user.tag} (${member.user.id})\` kullanıcısının sunucuya erişimi kesildi! \`(Tag: ${tag})\``);

        });

    };

    ///Server Security
    let penal1 = await Penals.findOne({ guildID: member.guild.id, userID: member.id, type: "JAIL", active: true });
    let penal2 = await Penals.findOne({ guildID: member.guild.id, userID: member.id, type: "TEMP-JAIL", active: true });
    let penal3 = await Penals.findOne({ guildID: member.guild.id, userID: member.id, type: "CHAT-MUTE", active: true });
    let penal4 = await Penals.findOne({ guildID: member.guild.id, userID: member.id, type: "VOICE-MUTE", active: true });

    if(penal1 || penal2) {

        await client.wait(3000).then(() => member.roles.set(jailRoles));

        let channel = member.guild.channels.cache.get(securityLog);

        if(channel && channel.type == 'text') channel.send(Embed.setTitle(`${penal1 ? 'Jail Taraması :' : `Temp-Jail Taraması :`}`).setDescription(`Sunucuya yeni katılan ${member.toString()} kullanıcısında \`#${penal1 ? penal1.id : penal2.id}\` ID'li aktif **${penal1 ? 'JAIL' : `TEMP-JAIL`}** cezası tespit edildi. Sunucu güvenliği için kullanıcı tekrar **jaile** atıldı !`));
        
        member.send(`**${member.guild.name}** adlı sunucuda \`#${penal1 ? penal1.id : penal2.id}\` ID'li aktif **${penal1 ? 'JAIL' : `TEMP-JAIL`}** cezasına sahip olduğunuzu tespik ettik. Sunucu güvenliği için tekrar **jaile** atıldınız!`);

        if(penal3) {

            await client.wait(3000).then(() => member.roles.add(cmuteRoles));

            if(channel && channel.type == 'text') channel.send(Embed.setTitle(`Chat-Mute Taraması :`).setDescription(`Sunucuya yeni katılan ${member.toString()} kullanıcısında \`#${penal3.id}\` ID'li aktif **CHAT-MUTE** cezası tespit edildi. Sunucu güvenliği için kullanıcı **metin kanallarında** tekrar susturuldu!`));
        
            member.send(`**${member.guild.name}** adlı sunucuda \`#${penal3.id}\` ID'li aktif **CHAT-MUTE** cezasına sahip olduğunuzu tespik ettik. Sunucu güvenliği için **metin kanallarında** tekrar susturuldunuz!`);

        };

        if(penal4) {

            await client.wait(3000).then(() => member.roles.add(vmuteRoles));

            if(channel && channel.type == 'text') channel.send(Embed.setTitle(`Voice-Mute Taraması :`).setDescription(`Sunucuya yeni katılan ${member.toString()} kullanıcısında \`#${penal4.id}\` ID'li aktif **VOICE-MUTE** cezası tespit edildi. Sunucu güvenliği için kullanıcı **ses kanallarında** tekrar susturuldu!`));
        
            member.send(`**${member.guild.name}** adlı sunucuda \`#${penal4.id}\` ID'li aktif **VOICE-MUTE** cezasına sahip olduğunuzu tespik ettik. Sunucu güvenliği için **ses kanallarında** tekrar susturuldunuz!`);

        };

    } else if(!penal1 && !penal2) {

        let channel = member.guild.channels.cache.get(securityLog);

        if(penal3) {

            await client.wait(3000).then(() => member.roles.add(cmuteRoles));

            if(channel && channel.type == 'text') channel.send(Embed.setTitle(`Chat-Mute Taraması :`).setDescription(`Sunucuya yeni katılan ${member.toString()} kullanıcısında \`#${penal3.id}\` ID'li aktif **CHAT-MUTE** cezası tespit edildi. Sunucu güvenliği için kullanıcı **metin kanallarında** tekrar susturuldu!`));
        
            member.send(`**${member.guild.name}** adlı sunucuda \`#${penal3.id}\` ID'li aktif **CHAT-MUTE** cezasına sahip olduğunuzu tespik ettik. Sunucu güvenliği için **metin kanallarında** tekrar susturuldunuz!`);

        };

        if(penal4) {

            await client.wait(3000).then(() => member.roles.add(vmuteRoles));

            if(channel && channel.type == 'text') channel.send(Embed.setTitle(`Voice-Mute Taraması :`).setDescription(`Sunucuya yeni katılan ${member.toString()} kullanıcısında \`#${penal4.id}\` ID'li aktif **VOICE-MUTE** cezası tespit edildi. Sunucu güvenliği için kullanıcı **ses kanallarında** tekrar susturuldu!`));
        
            member.send(`**${member.guild.name}** adlı sunucuda \`#${penal4.id}\` ID'li aktif **VOICE-MUTE** cezasına sahip olduğunuzu tespik ettik. Sunucu güvenliği için **ses kanallarında** tekrar susturuldunuz!`);

        };

    }

};

module.exports.conf = {
    name: 'Guild Member Add',
    event: 'guildMemberAdd'
};