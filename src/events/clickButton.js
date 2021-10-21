const { client } = global;
const { registration, logs } = client.guildSettings;
const { unregisterName, unregisterRoles, quarantineRole } = registration;
const { buttonLog } = logs;

/**
 * @param { MessageButton } button 
 */

module.exports = async (button) => {

    let member = button.clicker.member;
    let log = client.channels.cache.get(buttonLog);

    if(button.id == 'account-control') {

        await button.reply.think(true);
        
        if(!member.roles.cache.has(quarantineRole) || member.hasPermission(8)) return button.reply.edit(`Sen karantinada değilsin!`).then(msg => {
            if(log && log.type == 'text') log.send(`\`${button.clicker.user.tag}\` isimli karantinada olmayan bir kullanıcı hesabını kontrol etti!`);
        });
        
        let date =  new Date().getTime() - member.user.createdAt.getTime();
        let date2 = await client.duration(date);
        
        if(date <  604800000) {
          
          button.reply.edit(`Hesabın **${moment(member.user.createdAt).format("DD MMMM YYYY dddd")}** tarihinde ( \`${date2} önce\` ) oluşturulmuş. Daha 1 hafta olmadığı için içeriye alınamazsın!`);
          
          if(log && log.type == 'text') log.send(`\`${button.clicker.user.tag}\` isimli bir kullanıcı hesabını kontrol etti. Hesabının açılma süresi daha 1 haftayı geçmediği için karantinada bırakıldı!`);
          
        } else {
          
          button.reply.edit(`Hesabın **${moment(member.user.createdAt).format("DD MMMM YYYY dddd")}** tarihinde ( \`${date2} önce\` ) oluşturulmuş. Artık içeri gire bilirsin!`);
          if(log && log.type == 'text') log.send(`\`${button.clicker.user.tag}\` isimli bir kullanıcı hesabını kontrol etti. Hesabının açılma süresi 1 haftayı geçtiği için karantinadan çıkarıldı!`);
          
          setTimeout(() => {
            
            member.roles.set(unregisterRoles);
            member.setNickname(unregisterName);
            
          }, 5000);
          
        };

    };

};

module.exports.conf = {
    name: 'Click Button',
    event: 'clickButton',
};