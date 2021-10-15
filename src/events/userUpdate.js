const { client } = global;
const { guildID, dmMessages, registration } = client.guildSettings;
const { unregisterRoles } = registration;
const { forbidRoles, forbidChannel, forbidLog } = client.guildSettings.forbiddenTag;
const forbiddenTag = require('../schemas/forbiddenTag.js');

/**
 * @param { User } oldUser 
 * @param { User } newUser 
 */

module.exports = async (oldUser, newUser) => {

    if(oldUser.bot || newUser.bot || (oldUser.username === newUser.username)) return;

    let guild = client.guilds.cache.get(guildID);
    if(!guild) return;
    
    let member = guild.members.cache.get(newUser.id);
    if(!member) return;

    let data = await forbiddenTag.findOne({ guildID: guild.id });

    if(data && data.forbiddenTags.length && data.forbiddenTags.some(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))) {

        setTimeout(() => {

            if(member.manageable) member.roles.set(forbidRoles);
            let tag = data.forbiddenTags.find(tag => newUser.username.includes(tag));
            if(dmMessages) newUser.send(`Yeni kullanıcı adınızda bulunan \`${tag}\` tagı **${guild.name}** sunucusunun yasaklı taglarından biri olduğu için sunucuya erişiminiz kesildi!`).catch(() => {});
            guild.channels.cache.get(forbidChannel).send(`${newUser.toString()}, Maalesef yeni kullanıcı adın sunucumuzdaki yasaklı taglardan birini ( \`${tag}\` ) içeriyor. Bu sebeple sunucuya erişemezsin!`);
            guild.channels.cache.get(forbidLog).send(`\`${member.user.tag} (${member.user.id})\` kullanıcısının sunucuya erişimi kesildi! \`(Tag: ${tag})\``);

        }, 2000);

    } else if(data && data.forbiddenTags.length && data.forbiddenTags.some(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag))) {

        setTimeout(() => {

            if(member.manageable) member.roles.set(unregisterRoles);
            let tag = data.forbiddenTags.find(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag));
            if(dmMessages) newUser.send(`Kullanıcı adınızda bulunan ve **${guild.name}** sunucusunun yasaklı taglarından biri olan \`${tag}\` tagını kullanıcı adınızdan saldığınız için sunucuya erişiminiz tekrar açıldı!`).catch(() => {});
            guild.channels.cache.get(forbidLog).send(`\`${member.user.tag} (${member.user.id})\` kullanıcısının sunucuya erişimi açıldı! \`(Tag: ${tag})\``);

        }, 2000);

    };

};

module.exports.conf = {
    name: 'User Update',
    event: 'userUpdate'
};