const reload = require('../../schemas/reload.js');
const { loading } = require('../../configs/emojis.json');

module.exports = {
    name: 'reload',
    aliases: ['restart', 'reboot'],
    category: 'Developer',
    developer: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args
     * @param { MessageEmbed } Embed
     */

    async execute(client, message, args, Embed) {
       
        await message.channel.send(`**Yeniden başlatılıyor** ${loading ? loading : ``}`).then(async msg => {

            console.log('[BOT] Started to reload');
            await new reload({ type: 'moderation', authorID: message.author.id, channelID: msg.channel.id, messageID: msg.id }).save();

        });

        process.exit();

    },
};