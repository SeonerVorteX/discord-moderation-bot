const { writeFile } = require('fs');
const { systemEmojis } = global.client;
const emojis = require('../../configs/emojis.json');

module.exports = {
    name: 'emojikur',
    aliases: ['emoji-kur'],
    category: 'Developer',
    developer: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */

    async execute(client, message, args) {

        message.channel.send(`**Sistem emojileri kurulmaya başladı** ${emojis.loading ? emojis.loading : ``}`).then(async msg => {

            await new Promise(async (resolve) => {

                systemEmojis.filter(systemEmoji => !emojis[systemEmoji.emojiName]).forEach(async (systemEmoji, index)=> {

                    if(message.guild.emojis.cache.find(e => e.name == systemEmoji.emojiName)) emojis[systemEmoji.emojiName] = message.guild.emojis.cache.find(e => e.name == systemEmoji.emojiName).toString();
                    else {

                        await client.wait(index * 250);
                        await message.guild.emojis.create(systemEmoji.emojiUrl, systemEmoji.emojiName).then(emoji => {

                            emojis[emoji.name] = emoji.toString();
                            writeFile('./src/configs/emojis.json', JSON.stringify(emojis, null, 2), err => {
                                if(err) console.log(err);
                            });

                        });

                    };
                    
                });

                await client.wait(systemEmojis.filter(systemEmoji => !emojis[systemEmoji.emojiName]).length * 250).then(resolve)
                
            });

            msg.edit(`**Sistem emojileri başarıyla kuruldu ${emojis['success']}**`);
    
        });

    },
};