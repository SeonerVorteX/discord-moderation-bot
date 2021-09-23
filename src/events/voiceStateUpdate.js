const { vmuteRoles } = global.client.guildSettings.penals.voiceMute;
const { voiceLog } = global.client.guildSettings.logs;
const { unMuted, muted, unDeafen, deafen, joined, leaved, camera, stream, changeState } = require('../configs/emojis.json');
const voiceJoinedAt = require('../schemas/voiceJoinedAt.js');
const penals = require('../schemas/penals.js');

/**
 * @param { VoiceChannel } oldState 
 * @param { VoiceChannel } newState 
 */

module.exports = async (oldState, newState) => {

    if (!oldState.channelID && newState.channelID) await voiceJoinedAt.findOneAndUpdate({ guildID: newState.guild.id, userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
    else if (oldState.channelID && !newState.channelID) await voiceJoinedAt.findOneAndDelete({ guildID: oldState.guild.id, userID: oldState.id });

    let penal = await penals.findOne({ guildID: newState.guild.id, userID: newState.member.id, type: 'VOICE-MUTE', active: true });
    let penal2 = await penals.findOne({ guildID: newState.guild.id, userID: newState.member.id, type: 'VOICE-MUTE', removed: false, temp: true, finishDate: { $lte: Date.now() }})

    if(penal) {

        if(!newState.serverMute) newState.setMute(true);
        if(!vmuteRoles.some(role => newState.member.roles.cache.has(role))) newState.member.roles.add(vmuteRoles);

    };

    if(penal2) {

        if(newState.serverMute) newState.setMute(false);
        if(vmuteRoles.some(role => newState.member.roles.cache.has(role))) newState.member.roles.remove(vmuteRoles);
        penal2.finishDate = Date.now();
        penal2.active = false;
        penal2.removed = true;
        await penal2.save();

    };

    if(voiceLog) {

        let vLog = client.channels.cache.get(voiceLog);

        if(!vLog) return;
        if(!oldState.channel && newState.channel) return vLog.send(`${joined ? joined : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı **ses kanalına girdi!**`);
        
        if(oldState.channel && !newState.channel) {

            let audit = await newState.guild.fetchAuditLogs();
            let entry = audit.entries.first();
            if(entry && entry.action == 'MEMBER_DISCONNECT' && entry.executor.id !== client.user.id) return vLog.send(`${leaved ? leaved : ``} \`${newState.member.displayName}\` üyesinin ${oldState.channel.toString()} adlı ses kanalındaki bağlantısı \`${newState.guild.members.cache.get(entry.executor.id).displayName}\` tarafından **kesildi!**`);
            if(entry && entry.action == 'MEMBER_DISCONNECT' && entry.executor.id == client.user.id) return;
            return vLog.send(`${leaved ? leaved : ``} \`${newState.member.displayName}\` üyesi ${oldState.channel.toString()} adlı **ses kanalından ayrıldı!**`);

        };

        if(oldState.channel.id && newState.channel.id && oldState.channel.id !== newState.channel.id) {

            let audit = await newState.guild.fetchAuditLogs();
            let entry = audit.entries.first();
            if(entry && entry.action == 'MEMBER_MOVE' && entry.executor.id !== newState.id && entry.executor.id !== client.user.id) return vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${newState.member.displayName}\` üyesi \`${newState.guild.members.cache.get(entry.executor.id).displayName}\` tarafından ${oldState.channel.toString()} adlı ses kanalından ${newState.channel.toString()} adlı ses kanalına **taşındı!**`);
            
            if(!entry || entry.executor.id !== client.user.id) return vLog.send(`${changeState ? changeState : `:arrow_up_down:`} \`${newState.member.displayName}\` üyesi ${oldState.channel.toString()} adlı ses kanalından ${newState.channel.toString()} adlı ses kanalına **geçiş yaptı!**`);

        };

        if(oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return vLog.send(`${unDeafen ? unDeafen : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **kulaklığını açtı!**`);
        if(oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return vLog.send(`${deafen ? deafen : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **kulaklığını kapattı!**`);
        if(oldState.channel.id && oldState.selfMute && !newState.selfMute) return vLog.send(`${unMuted ? unMuted : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **mikrofonunu açtı!**`);
        if(oldState.channel.id && !oldState.selfMute && newState.selfMute) return vLog.send(`${muted ? muted : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **mikrofonunu kapattı!**`);

        if(oldState.channel.id && oldState.serverMute && !newState.serverMute) {
            
            let audit = await newState.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' });
            let executor = audit.entries.first().executor;
            
            if(executor.id == global.client.user.id) return;
            else return vLog.send(`${unMuted ? unMuted : ``} \`${newState.member.displayName}\` üyesinin ${newState.channel.toString()} adlı ses kanalındaki susturulması \`${newState.guild.members.cache.get(executor.id).displayName}\` tarafından **kaldırıldı!**`);

        };

        if(oldState.channel.id && !oldState.serverMute && newState.serverMute) {
            
            let audit = await newState.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' });
            let executor = audit.entries.first().executor;

            if(executor.id == global.client.user.id) return;
            else return vLog.send(`${muted ? muted : ``} \`${newState.member.displayName}\` üyesi \`${newState.guild.members.cache.get(executor.id).displayName}\` tarafından ${newState.channel.toString()} adlı ses kanalında **susturuldu!**`);

        };

        if(oldState.channel.id && oldState.serverDeaf && !newState.serverDeaf) {
            
            let audit = await newState.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' });
            let executor = audit.entries.first().executor;
            return vLog.send(`${unDeafen ? unDeafen : ``} \`${newState.member.displayName}\` üyesinin ${newState.channel.toString()} adlı ses kanalındaki sağırlığı \`${newState.guild.members.cache.get(executor.id).displayName}\` tarafından **kaldırıldı!**`);

        };

        if(oldState.channel.id && !oldState.serverDeaf && newState.serverDeaf) {
            
            let audit = await newState.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' });
            let executor = audit.entries.first().executor;
            return vLog.send(`${deafen ? deafen : ``} \`${newState.member.displayName}\` üyesi \`${newState.guild.members.cache.get(executor.id).displayName}\` tarafından ${newState.channel.toString()} adlı ses kanalında **sağırlaştırıldı!**`);

        };

        if(oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) return vLog.send(`${stream ? stream : `:desktop:`} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **yayın açtı!**`);
        if(oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) return vLog.send(`${stream ? stream : `:desktop:`} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **yayını kapattı!**`);
        if(oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) return vLog.send(`${camera ? camera : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **kamerasını açtı!**`);
        if(oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) return vLog.send(`${camera ? camera : ``} \`${newState.member.displayName}\` üyesi ${newState.channel.toString()} adlı ses kanalında **kamerasını kapattı!**`);

    };

};

module.exports.conf = {
    name: 'Voice State Update',
    event: 'voiceStateUpdate'
}