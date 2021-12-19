const { TextChannel, MessageEmbed, WebhookClient, Collection } = require('discord.js');
const { Owners, Prefix } = global.client.settings;
const afk = require('../../schemas/afk.js');
const reload = require('../../schemas/reload.js');
const penals = require('../../schemas/penals.js');
const staffs = require('../../schemas/staffs.js');
const alarms = require('../../schemas/alarms.js');
const roleLog = require('../../schemas/roleLog.js');
const commands = require('../../schemas/commands.js');
const forceBans = require('../../schemas/forceBans.js');
const forbiddenTag = require('../../schemas/forbiddenTag');
const administrators = require('../../schemas/administrators.js');
const penalPoints = require('../../schemas/penalPoints.js');
const voiceJoinedAt = require('../../schemas/voiceJoinedAt.js');
const emojis = require('../../configs/emojis.json');
const fs = require('fs');
const ms = require('ms');
const moment = require('moment');
moment.locale('tr');

module.exports = {
  
  name: 'eval',
  aliases: ['evaluate', 'vortex'],
  category: 'Developer',
  usage: '<Code>', 
  developer: true,

  /**
   * @param { Client } client 
   * @param { Message } message 
   * @param { Array<String> } args
   * @param { MessageEmbed } Embed
   */

  async execute(client, message, args, Embed){
    
    if (!args[0]) return message.channel.error(message, `Kod belirtilmedi`, { timeout: 8000, reply: true });
    let code = args.join(' ');
    if(message.channel.type == 'text') message.delete({ reason: "eval" }).catch(() => {});
    function clean(text) {
      
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 });
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      return text;
      
    };
    
    try { 
      
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Secret Information");
      message.channel.send(`${evaled.replace(client.token, "Secret Information")}`, { code: 'js', split: true });
    
    } 
    catch(err) { message.channel.send(err, { code: 'js', split: true }) };
  
  },
};
