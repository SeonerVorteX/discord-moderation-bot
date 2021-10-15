const { MessageEmbed } = require('discord.js');
const { Footer } = global.client.settings;

/**
 * @param { String } authorName 
 * @param { String } authorAvatar 
 * @param { String } description 
 * @param { String } footer 
 * @param { String } color 
 */

module.exports = (authorName, authorAvatar, description, footer = Footer, color = "RANDOM") => {
    const Embed = new MessageEmbed()
        .setAuthor(authorName || authorName == 'false' ? authorName : '', authorAvatar || authorAvatar == 'false' ? authorAvatar : '')
        .setDescription(description || description == 'false' ? description : '')
        .setFooter(footer)
        .setColor(color);

    return Embed;
};