const { TextChannel, DMChannel, Collection } = require("discord.js");
const ms = require('parse-ms');
const penals = require('../schemas/penals.js');
const penalPoints = require('../schemas/penalPoints.js');
const { mark, cross } = require('../configs/emojis.json');

module.exports = async (client) => {

    /**
     * @param { String } userID 
     */

    client.fetchUser = async (userID) => {

        try {
          return await client.users.fetch(userID).then(user => user);
        } catch (err) {
          return undefined;
        };

    };

    /**
     * 
     * @param { Guild } guild 
     * @param { String } userID 
     */
    
    client.fetchBan = async (guild, userID) => {

        try {
            return await guild.fetchBan(userID).then(bannedUser => bannedUser);
        } catch (err) {
            return undefined;
        }

    };

    /**
     * @param { String } guildID 
     * @param { String } userID 
     * @param { String } type 
     * @param { Boolean } active 
     * @param { String } staff 
     * @param { String } reason 
     * @param { Boolean } temp 
     * @param { Number } date 
     * @param { Number } finishDate 
     */

    client.newPenal = async (guildID, userID, type, active = true, staff, reason, temp = false, date = Date.now(), finishDate = undefined) => {

        let id = await penals.find({ guildID });
        id = id ? id.length + 1 : 1;
        return await new penals({ id, userID, guildID, type, active, staff, reason, temp, date, finishDate }).save();

    };

    /**
     * @param { String } guildID 
     * @param { String } userID 
     * @param { Number } penalPoint 
     */

    client.addPenalPoint = async (guildID = client.guildSettings.guildID, userID, penalPoint) => {

        await penalPoints.findOneAndUpdate({ guildID, userID }, { $inc: { penalPoint: parseInt(penalPoint) } }, { upsert: true });
        return await penalPoints.findOneAndUpdate({ guildID, userID });

    };

    /**
     * @param { Number } ms 
     */

    client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * @param { Number } time
     */

    client.duration = async (time) => {

        if(!time) throw new ReferenceError("Time Is Not Defined");
        let Date = ms(time);
        let date = `${Date.days} gün, ${Date.hours} saat, ${Date.minutes} dakika, ${Date.seconds} saniye`;
        
        if(Date.days == 0 && Date.hours == 0 && Date.minutes == 0 && Date.seconds == 0) {
            if(Date.milliseconds !== 0 || Date.microseconds !== 0 || Date.nanoseconds !== 0) {
              return "1 saniye"
            }
        } else if(Date.days == 0 && Date.hours == 0 && Date.minutes == 0 && Date.seconds !== 0) {
            return date.replace(`0 gün, 0 saat, 0 dakika, `, ``);
        } else if(Date.days == 0 && Date.hours == 0 && Date.minutes !== 0){
            return date.replace(`0 gün, 0 saat, `, ``);
        } else if(Date.days == 0 && Date.hours !== 0){
            return date.replace(`0 gün, `, ``);
        } else return date;

    };

    /**
     * @param { String } duration 
     */

    client.replaceDuration = (duration) => {

        if(!duration) throw new ReferenceError(`Duration Is Not Defined`);

        duration = duration.trim().toLocaleString()
        .replace('minute', '')
        .replace('m', '')
        .replace('dk', '')
        .replace('dakika', '')

        .replace('day', '')
        .replace('d', '')
        .replace('gün', '')
        .replace('g', '')

        .replace('hour', '')
        .replace('h', '')
        .replace('st', '')
        .replace('saat', '')

        .replace('saniye', '')
        .replace('sn', '')
        .replace('s', '')
        
        return duration;

    };

    /**
     * @param { String } duration
     */

    client.ms = async (duration) => {

        if(!duration) throw new ReferenceError(`Duration Is Not Defined`);

        duration.trim();

        if(['m', 'minute', 'dk', 'dakika'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('minute')) arg = 'minute'
            else if(duration.includes('m')) arg = 'm'
            else if(duration.includes('dakika')) arg = 'dakika'
            else if(duration.includes('dk')) arg = 'dk'

            duration = duration.replace(arg, 'm');

            return { duration: duration, durationMsg: await duration.replace('m', ' dakika')};

        } else if(['day', 'd', 'gün', 'g'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('day')) arg = 'day'
            else if(duration.includes('d')) arg = 'd'
            else if(duration.includes('gün')) arg = 'gün'
            else if(duration.includes('g')) arg = 'g'

            duration = duration.replace(arg, 'd');

            return { duration: duration, durationMsg: await duration.replace('d', ' gün')};

        } else if(['h', 'hour', 'st', 'saat'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('hour')) arg = 'hour'
            else if(duration.includes('h')) arg = 'h'
            else if(duration.includes('saat')) arg = 'saat'
            else if(duration.includes('st')) arg = 'st'

            duration = duration.replace(arg, 'h');

            return { duration: duration, durationMsg: await duration.replace('h', ' saat')};

        } else if(['s', 'sn', 'saniye'].some(arg => duration.includes(arg))) {

            let arg;

            if(duration.includes('saniye')) arg = 'saniye'
            else if(duration.includes('sn')) arg = 'sn'
            else if(duration.includes('s')) arg = 's'

            duration = duration.replace(arg, 's');

            return { duration: duration, durationMsg: await duration.replace('s', ' saniye')};

        };

    };

    /**
     * @param { Collection } collection 
     * @param { String } dataName 
     * @param { Number } count 
     * @param { Object } options 
     */

    Collection.prototype.add = async (collection, dataName, count, options) => {

        if(!collection) throw new ReferenceError(`Collection Is Not Defined`);
        if(!dataName) throw new ReferenceError(`Collection Data Is Not Defined`);

        let data = await collection.get(dataName);

        if(!data && !options) throw new ReferenceError(`Data Not Found`);
        if(!count) throw new ReferenceError(`Count Is Not Defined`);
        if(isNaN(count) || count == 0 || count.toLocaleString().includes('-')) throw new SyntaxError('Invalid Argument: Count')
        if(!options) {
            
            collection.set(dataName, parseInt(data)+parseInt(count));
            return collection;

        } else {

            let name = options.name;

            if(data[name] && (isNaN(data[name]) || data[name] == 0 || data[name].toLocaleString().includes('-'))) throw new Error('Data Is Not A Number');

            data[name] = parseInt(!data[name] ? 0 : data[name]) + parseInt(count);
            collection.set(dataName, data);
            return collection.get(dataName);

        };

    }

    /**
     * @param { Message } message 
     */

    TextChannel.prototype.wsend = async function (message) {

        const hooks = await this.fetchWebhooks();
        let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
        if (webhook) return hook.send(message);
        else {
            webhook = await this.createWebhook(client.user.username, { avatar: client.user.avatarURL() });
            return webhook.send(message);
        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */

    TextChannel.prototype.true = function (message, text, options) {

        if(!message) throw new ReferenceError('Message Is Not Defined');
        if(!text) throw new ReferenceError('Text Is Not Defined');
        if(!options) options = {}

        let reply = options.reply
        let time = options.timeout
        let react = options.react
        let deleteMsg = options.deleteMessage

        if(time && (isNaN(time) || time == 0 || time.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: Timeout');
        if(reply && typeof(reply) !== "boolean") throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== "boolean") throw new SyntaxError('Invalid Argument: React');
        if(deleteMsg && typeof(deleteMsg) !== "boolean" && (isNaN(deleteMsg) || deleteMsg == 0 || deleteMsg.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: DeleteMessage');
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            if(react) message.react(mark);
            message.reply(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });
            if(message && deleteMsg) {

                if(typeof(deleteMsg) == 'boolean') return message.delete();
                else if(typeof(parseInt(deleteMsg)) !== 'boolean') return message.delete({ timeout: parseInt(deleteMsg) });

            };

        } else {

            if(react) message.react(mark);
            message.channel.send(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });
            if(message && deleteMsg) {

                if(typeof(deleteMsg) == 'boolean') return message.delete();
                else if(typeof(parseInt(deleteMsg)) !== 'boolean') return message.delete({ timeout: parseInt(deleteMsg) });

            };

        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */
  
    TextChannel.prototype.error =  function (message, text, options) {

        if(!message) throw new ReferenceError('Error Message Is Not Defined');
        if(!text) throw new ReferenceError('Error Text Is Not Defined');
        if(!options) options = {}

        let time = options.timeout
        let reply = options.reply
        let react = options.react
        let keepMsg = options.keepMessage

        if(time && (isNaN(time) || time == 0 || time.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: Timeout');
        if(reply && typeof(reply) !== "boolean") throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== "boolean") throw new SyntaxError('Invalid Argument: React');
        if(keepMsg && typeof(keepMsg) !== "boolean") throw new SyntaxError('Invalid Argument: KeepMessage');
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            if(react) message.react(cross);
            message.reply(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });
            if(message && time && !keepMsg) return message.delete({ timeout: parseInt(time) });

        } else {

            if(react) message.react(cross);
            message.channel.send(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });
            if(message && time && !keepMsg) return message.delete({ timeout: parseInt(time) });

        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */

     DMChannel.prototype.true = function (message, text, options) {

        if(!message) throw new ReferenceError('Message Is Not Defined');
        if(!text) throw new ReferenceError('Text Is Not Defined');
        if(!options) options = {};

        let reply = options.reply;
        let time = options.timeout;
        let react = options.react;

        if(time && (isNaN(time) || time == 0 || time.toLocaleString().includes('-'))) throw new SyntaxError('Invalid Argument: Timeout');
        if(reply && typeof(reply) !== "boolean") throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== "boolean") throw new SyntaxError('Invalid Argument: React');
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            if(react) message.react(mark);
            message.reply(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });

        } else {

            if(react) message.react(mark);
            message.channel.send(text).then(msg => {
                if(time) msg.delete({ timeout: parseInt(time) });
            });

        };

    };

    /**
     * @param { Message } message 
     * @param { String } text 
     * @param { Object } options 
     */
  
    DMChannel.prototype.error =  function (message, text, options) {

        if(!message) throw new ReferenceError('Error Message Is Not Defined');
        if(!text) throw new ReferenceError('Error Text Is Not Defined');
        if(!options) options = {};

        let time = options.timeout;
        let reply = options.reply;
        let react = options.react;

        if(reply && typeof(reply) !== "boolean") throw new SyntaxError('Invalid Argument: Author');
        if(react && typeof(react) !== "boolean") throw new SyntaxError('Invalid Argument: React');
        if(reply) {

            if(!message.author) throw new TypeError('Invalid Argument: Message');

            if(react) message.react(cross);
            message.reply(text);

        } else {

            if(react) message.react(cross);
            message.channel.send(text);

        };

    };

    Array.prototype.random = function () {
    
        return this[Math.floor((Math.random() * this.length))];
        
    };

    /**
     * @param { Number } chunk_size 
     */

    Array.prototype.chunk = function(chunk_size) {

        let myArray = Array.from(this);
        let tempArray = [];

        for (let index = 0; index < myArray.length; index += chunk_size) {

            let chunk = myArray.slice(index, index + chunk_size);
            tempArray.push(chunk);

        };

        return tempArray;
        
    };

};