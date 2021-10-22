const { mark, loading } = require('../../configs/emojis.json');

module.exports = {
    name: 'ping',
    aliases: [],
    category: 'Developer',
    developer: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */

    execute(client, message, args) {

        if(mark) message.react(mark);
        message.channel.send(`Ping Hesaplanıyor ${loading ? loading : ``}`).then(msg => {

            msg.edit(`
Discord Gecikmesi : **${client.ws.ping} ms**
Mesaj Gecikmesi : **${msg.createdTimestamp - message.createdTimestamp} ms**
            `);

        });

    },
};