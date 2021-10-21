const { client } = global;
const { statusMessages } = client;
const { Prefix, VoiceChannel, Activity, Status } = client.settings;
const { guildID, dmMessages, penals, registration } = client.guildSettings;
const { jail, chatMute, voiceMute } = penals;
const { unregisterRoles } = registration;
const { jailed, unMuted, unCMuted } = require('../configs/emojis.json');
const commands = require('../schemas/commands.js');
const reload = require('../schemas/reload.js');
const Penals = require('../schemas/penals.js');
const embed = require('../utils/Embed.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = async () => {

    console.log(`[BOT] Connected to ${client.user.tag}`);
    
//Status
    client.user.setPresence({ activity: { type: Activity, name: statusMessages.random() }, status: Status });
    
    setInterval(() => {
    
        client.user.setPresence({ activity: { type: Activity, name: statusMessages.random() }, status: Status });
        console.log(`[STATUS] Status Has Been Updated`);
    
    }, 600000);

//Voice 
    let channel = client.channels.cache.get(VoiceChannel);
    
    if (!channel) console.log(`[VOICE-ERROR] Voice Channel Not Found`);
    else channel.join().then(connection => console.log(`[VOICE] Connected To The Voice Channel`)).catch(err => console.log(`[VOICE] Could Not Connect To Voice Channel`));
    
    setInterval(() => {
        
        channel.join().then(connection => console.log(`[VOICE-REFRESH] Connection On Voice Channel Has Been Refreshed`)).catch(err => console.log(`[VOICE] Could Not Refresh Connection On Voice Channel`));
        
    }, 600000);

//Reload
    let data = await reload.findOne({ type: "moderation" });

    if(data) {

        client.channels.cache.get(data.channelID).messages.fetch(data.messageID).then(async msg => {

            console.log('[BOT] Connection reloaded');
            await msg.edit("**Yeniden Başlatıldı!**");
            await reload.findOneAndDelete({ type: "moderation" });

        });

    };

//Checking Penals

    let Embed = embed(false, false, false);
    let guild = client.guilds.cache.get(guildID);
    setInterval(async () => {
        
        let datas = await Penals.find({ guildID: guild.id, active: true });

        if(guild && datas.length) {

            datas.filter(data => data.finishDate && data.finishDate < Date.now()).forEach(async (data, index) => {

                client.wait(index * 1000);
                
                if(data.type == 'TEMP-JAIL') {

                    data.active = false;
                    await data.save();
                    let user = await client.fetchUser(data.userID).then(user => user);
                    let member = guild.members.cache.get(user.id);
                    let staff = await client.fetchUser(data.staff).then(user => user);
                    let channel = client.channels.cache.get(jail.log);
                    if(member && guild.members.cache.has(user.id) && jail.jailRoles.some(role => member.roles.cache.has(role)) && member.manageable) member.roles.set(unregisterRoles);
                    if(jail.log && channel) channel.send(Embed.setColor('#00FF00').setAuthor(member.user.username, member.user.avatarURL({ dynamic: true })).setDescription(`
${user.toString()} kullanıcısının **temp-jail** cezasının süresi bitti!
                    
**Ceza ID :** \`#${data.id}\`
**Jaillenen Kullanıcı :** \`${user.tag} (${user.id})\`
**Jailleyen Yetkili :** \`${staff.tag} (${staff.id})\`
**Jaillenme Tarihi :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Jailin Bitiş Tarihi :** \`${moment(data.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Jaillenme Sebebi :** \`${!data.reason ? 'Belirtilmedi!' : data.reason}\`
                    `));

                    if(dmMessages) user.send(`${jailed} \`${member.guild.name}\` sunucusunda, **${staff.tag}** tarafından, ${!data.reason ? '' : `\`${data.reason}\` sebebiyle`} aldığınız **temp-jail** cezasının süresi bitti! \`(Ceza ID : #${data.id})\``).catch(() => {});

                };

                if(data.type == 'CHAT-MUTE') {

                    data.active = false;
                    await data.save();
                    let user = await client.fetchUser(data.userID).then(user => user);
                    let member = guild.members.cache.get(user.id);
                    let staff = await client.fetchUser(data.staff).then(user => user);
                    let channel = client.channels.cache.get(chatMute.log);
                    if(member && guild.members.cache.has(user.id) && chatMute.cmuteRoles.some(role => member.roles.cache.has(role)) && member.manageable) member.roles.remove(chatMute.cmuteRoles);
                    if(chatMute.log && channel) channel.send(Embed.setColor('#00FF00').setAuthor(member.user.username, member.user.avatarURL({ dynamic: true })).setDescription(`
${user.toString()} kullanıcısının **metin kanallarında** olan susturulmasının süresi bitti!

**Ceza ID :** \`#${data.id}\`
**Susturulan Kullanıcı :** \`${user.tag} (${user.id})\`
**Susturan Yetkili :** \`${staff.tag} (${staff.id})\`
**Susturulma Tarihi :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulmanın Bitiş Tarihi :** \`${moment(data.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!data.reason ? 'Belirtilmedi!' : data.reason}\`
                    `));

                    if(dmMessages) user.send(`${unCMuted} \`${member.guild.name}\` sunucusunda, **${staff.tag}** tarafından, ${!data.reason ? '' : `\`${data.reason}\` sebebiyle`} **metin kanallarında** aldığınız susturulma cezasının süresi bitti! \`(Ceza ID : #${data.id})\``).catch(() => {});

                };

                if(data.type == 'VOICE-MUTE') {

                    data.active = false;
                    data.removed = true;
                    await data.save();
                    let user = await client.fetchUser(data.userID).then(user => user);
                    let member = guild.members.cache.get(user.id);
                    let staff = await client.fetchUser(data.staff).then(user => user);
                    let channel = client.channels.cache.get(voiceMute.log);
                    if(member && guild.members.cache.has(user.id) && voiceMute.vmuteRoles.some(role => member.roles.cache.has(role)) && member.manageable) member.roles.remove(voiceMute.vmuteRoles);
                    if(voiceMute.log && channel) channel.send(Embed.setColor('#00FF00').setAuthor(member.user.username, member.user.avatarURL({ dynamic: true })).setDescription(`
${user.toString()} kullanıcısının **ses kanallarında** olan susturulmasının süresi bitti!

**Ceza ID :** \`#${data.id}\`
**Susturulan Kullanıcı :** \`${user.tag} (${user.id})\`
**Susturan Yetkili :** \`${staff.tag} (${staff.id})\`
**Susturulma Tarihi :** \`${moment(data.date).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulmanın Bitiş Tarihi :** \`${moment(data.finishDate).format(`DD MMMM YYYY (HH:mm)`)}\`
**Susturulma Sebebi :** \`${!data.reason ? 'Belirtilmedi!' : data.reason}\`
                    `));

                    if(dmMessages) user.send(`${unMuted} \`${member.guild.name}\` sunucusunda, **${staff.tag}** tarafından, ${!data.reason ? '' : `\`${data.reason}\` sebebiyle`} **ses kanallarında** aldığınız susturulma cezasının süresi bitti! \`(Ceza ID : #${data.id})\``).catch(() => {});

                };

            })

        }

    }, 30000);

//Saving Commands
    setTimeout(async () => {
        
        if(!guildID) return;

        let index = 0;
        let commandData = await commands.findOne({ guildID: guildID });
        await client.commands.forEach(async command => {

            index += 1;
            client.wait(index * 250);

            if(commandData && commandData.moderationCommands && commandData.moderationCommands.some(name => name == Prefix+command.name && command.aliases.every(alias => commandData.moderationCommands.some(Name => Name == Prefix+alias)))) return;

            if(commandData && commandData.moderationCommands && commandData.moderationCommands.every(name => name !== Prefix+command.name)) await commands.findOneAndUpdate({ guildID: guildID }, { $push: { moderationCommands: Prefix+command.name } }, { upsert: true });
            else if(!commandData || !commandData.moderationCommands.length) await commands.findOneAndUpdate({ guildID: guildID }, { $push: { moderationCommands: Prefix+command.name } }, { upsert: true });

            if(commandData && commandData.moderationCommands && commandData.moderationCommands.length) command.aliases.filter(alias => !commandData.moderationCommands.some(name => name == Prefix+alias)).forEach(async alias => await commands.findOneAndUpdate({ guildID: guildID }, { $push: { moderationCommands: Prefix+alias } }, { upsert: true }));
            else if(!commandData || !commandData.moderationCommands.length) command.aliases.forEach(async alias => await commands.findOneAndUpdate({ guildID: guildID }, { $push: { moderationCommands: Prefix+alias } }, { upsert: true }));

        });
        console.log(`[BOT] Commands Saved!`);

    }, 5000);

};

module.exports.conf = {
    name: "Ready",
    event: "ready"
};