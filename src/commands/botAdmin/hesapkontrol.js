const { MessageButton,  MessageActionRow } = require("discord-buttons");

module.exports = {
    name: 'hesapkontrol',
    aliases: [],
    category: 'Developer',
    developer: true,
    guildOnly: true,

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     */

    execute(client, message, args) {

        let Button = new MessageButton()
            .setStyle('green')
            .setLabel('Kontrol Et')
            .setID('account-control');

        let Row = new MessageActionRow()
            .addComponents(Button);

        message.channel.send(`Selam, eğer hesabın 1 haftadan kısa sürede açıldığı için burdaysan ve artık hesabının açılmasından 1 hafta geçtiğini düşünüyorsan aşağıdaki butonla kontrol ede bilirsin`, Row);
        if(message) message.delete();

    },
};