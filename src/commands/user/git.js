const { voiceLog } = global.client.guildSettings.logs;
const { changeState } = require('../../configs/emojis.json');

module.exports = {
    name: 'git',
    aliases: [],
    category: 'Kullanıcı',
    usage: '<@Üye/ID>',
    guildOnly: true,
    cooldown: 5,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    execute(client, message, args, Embed) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let vLog = message.guild.channels.cache.get(voiceLog);

        if(!message.member.voice.channel) return message.channel.error(message, `Bir ses kanalında olmalısın!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(!args[0]) return message.channel.error(message, `Bir üye belirtmelisin!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(!user) return message.channel.error(message, `Geçerli bir üye belirtmelisn!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(user.id == message.author.id) return message.channel.error(message, `Bu işlemi kendine uygulayamazsın!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(!user.voice.channel) return message.channel.error(message, `Belirttiğin kullanıcı bir ses kanalında değil!`, { timeout: 10000, reply: true, react: true, keepMessage: true });
        if(user.voice.channel.id == message.member.voice.channel.id) return message.channel.error(message, `Belittiğin üye ile zaten aynı ses kanalındasın!`, { timeout: 10000, reply: true, react: true, keepMessage: true });

        message.channel.send(`${user.toString()}`, Embed.setDescription(`${message.member.toString()} kullanıcısı bulunduğun ( \`${user.voice.channel.name}\` ) ses kanalına gelmek istiyor. Kabul ediyormusun?`)).then(async msg => {

            let reactions = ['✅', '❌'];
            for (let reaction of reactions) await msg.react(reaction);

            const accept = msg.createReactionCollector((reaction, reactionUser) => reaction.emoji.name == "✅" && reactionUser.id == user.id, { time: 25000 });
            const deny = msg.createReactionCollector((reaction, reactionUser) => reaction.emoji.name == "❌" && reactionUser.id == user.id, { time: 25000 });

            accept.on("collect", async reaction => {
           
                accept.stop();
                deny.stop();
                msg.reactions.removeAll();

                await msg.edit(``, Embed.setDescription(`${user.toString()} kullanıcısı \`${user.voice.channel.name}\` isimli ses kanalına gelme isteğini kabul etti!`));
                
                if(vLog && vLog.type == 'text') vLog.send(`${changeState ? changeState : ':arrow_up_down:'} \`${message.member.displayName}\` üyesi ${message.member.voice.channel.toString()} adlı ses kanalından ${user.voice.channel.toString()} adlı ses kanalına **gitti!**`)

                return await message.member.voice.setChannel(user.voice.channel.id);
                
            });

            deny.on("collect", async reaction => {

                accept.stop();
                deny.stop();
                msg.reactions.removeAll();
                
                return await msg.edit(`${message.member.toString()}`, Embed.setDescription(`${user.toString()} kullanıcısı \`${user.voice.channel.name}\` isimli ses kanalına gelme isteğini redd etti!`));

            });

            accept.on("end", async reaction => {

                accept.stop();
                deny.stop();
                msg.reactions.removeAll();

                return await msg.edit(`${message.member.toString()}`, Embed.setDescription(`${user.toString()} kullanıcısı yanıt vermediği için istek redd edildi!`));

            });

        });

    },
};
