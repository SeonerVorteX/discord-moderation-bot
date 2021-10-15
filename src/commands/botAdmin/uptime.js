const { developer } = require('../../configs/emojis.json');

module.exports = {
    name: 'uptime',
    aliases: [],
    category: 'Developer',
    developer: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */
    
    async execute(client, message, args) {

        let uptime = await client.duration(Date.now() - client.readyAt.getTime(), { comma: true });
        message.channel.success(message, `Sistem **${uptime}dir** aktif ${developer ? developer : ``}`, { react: true });

    },
};