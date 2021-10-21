/**
 * Client Settings
 * @param { Client } client 
 */

module.exports = (client) => {

    //General Settings
    client.settings = {

        "Prefix": ".",
        "Token": "ODc1NjgyMjQ2Mzk5NTE2Njk0.YRZEpA.YRYQoJtNoypkGZZtwu31ago9DU4",
        "Owners": ["809325505304068096", "624914071984013313"],
        "OtherBots": ["855074136065048597", "873189554700574741", "819623504630251570", "880140912238420008"],
        "VoiceChannel": "836467888436019242",
        "Activity": "LISTENING",
        "Status": "idle",
        "MongoURL": "mongodb+srv://seonervortex:aze1234321@cluster0.argb1.mongodb.net/vortexTest?retryWrites=true&w=majority",
        "Footer": "VorteX",
        "DisableCooldownsForAdmins": true,

    };

    //Activity Messages
    client.statusMessages = [

        "Only VorteX!",
        "Created By VorteX!",
        "discord.gg/MTNkXHnX3b"

    ];

    client.systemEmojis = [

        ///System
        { emojiName: 'developer', emojiUrl: 'https://cdn.discordapp.com/emojis/853642013332865035.gif?v=1' },
        { emojiName: 'loading', emojiUrl: 'https://cdn.discordapp.com/emojis/857935194203226118.gif?v=1' },
        { emojiName: 'arrow', emojiUrl: 'https://cdn.discordapp.com/emojis/821298641863442442.gif?v=1' },
        { emojiName: 'crown', emojiUrl: 'https://cdn.discordapp.com/emojis/876942324909871114.gif?v=1' },
        { emojiName: 'crown2', emojiUrl: 'https://cdn.discordapp.com/emojis/876929331572662323.gif?v=1' },
        { emojiName: 'mark', emojiUrl: 'https://cdn.discordapp.com/emojis/876153262796079115.gif?v=1' },
        { emojiName: 'mark2', emojiUrl: 'https://cdn.discordapp.com/emojis/853641429146140684.png?v=1' },
        { emojiName: 'cross', emojiUrl: 'https://cdn.discordapp.com/emojis/876153078863253514.gif?v=1' },
        { emojiName: 'cross2', emojiUrl: 'https://cdn.discordapp.com/emojis/853641452227264522.png?v=1' },
        { emojiName: 'succes', emojiUrl: 'https://cdn.discordapp.com/emojis/793774156067373066.gif?v=1' },

        ///Status
        { emojiName: 'online', emojiUrl: 'https://cdn.discordapp.com/emojis/686601950275698692.png?v=1' },
        { emojiName: 'dnd', emojiUrl: 'https://cdn.discordapp.com/emojis/686601950355390545.png?v=1' },
        { emojiName: 'idle', emojiUrl: 'https://cdn.discordapp.com/emojis/686601950069915667.png?v=1' },
        { emojiName: 'offline', emojiUrl: 'https://cdn.discordapp.com/emojis/686601950686609420.png?v=1' },
        { emojiName: 'web', emojiUrl: 'https://cdn.discordapp.com/emojis/825429354707288065.png?v=1' },

        ///Penal
        { emojiName: 'banned', emojiUrl: 'https://cdn.discordapp.com/emojis/748618263071555645.gif?v=1' },
        { emojiName: 'jailed', emojiUrl: 'https://cdn.discordapp.com/emojis/878303820181024788.png?v=1' },
        { emojiName: 'chatMuted', emojiUrl: 'https://cdn.discordapp.com/emojis/878303318743609384.png?v=1' },
        { emojiName: 'warned', emojiUrl: 'https://cdn.discordapp.com/emojis/826369282942042112.png?v=1' },

        ///Voice
        { emojiName: 'joined', emojiUrl: 'https://cdn.discordapp.com/emojis/742688545977794560.gif?v=1' },   
        { emojiName: 'leaved', emojiUrl: 'https://cdn.discordapp.com/emojis/742688545168293968.gif?v=1' },
        { emojiName: 'unMuted', emojiUrl: 'https://cdn.discordapp.com/emojis/871710450633564271.png?v=1' },
        { emojiName: 'muted', emojiUrl: 'https://cdn.discordapp.com/emojis/871710451086524416.png?v=1' },
        { emojiName: 'unDeafen', emojiUrl: 'https://cdn.discordapp.com/emojis/871710450243502091.png?v=1' },
        { emojiName: 'deafen', emojiUrl: 'https://cdn.discordapp.com/emojis/871710450138619915.png?v=1' },
        { emojiName: 'camera', emojiUrl: 'https://cdn.discordapp.com/emojis/839043294717542400.png?v=1' }, 

    ];

    //Guild Settings     
    client.guildSettings = {

        ///General
        "guildID": "836467117393969163",
        "guildTags": [],
        "guildDiscriminator": "1927",
        "guildTeams": [],
        "guildChat": "",
        "dmMessages": true,

        ///Staffs
        "staffRoles": [],
        "staffGivers": [],
        "transporterSpears": [],
        "registerSpears": [],
        "botYt": "836467869633085480",

        ///Penals
        "penals": {

            ///Ban
            "ban": {
                "staffs": [],
                "penalPoint": 40,
                "penalLimit": 0,
                "log": "836467895156211772",
                "banGifs": ['https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307', 'https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif', 'https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194'],
                "unbanGifs": ['https://data.whicdn.com/images/192611812/original.gif'],
            },

            ///Jail
            "jail": {
                "staffs": ['836467871127306290'],
                "jailRoles": ['836467875647848459'],
                "jailChannel": "836467895156211772",
                "penalPoint": 30,
                "penalLimit": 0,
                "log": "836467895156211772",
            },

            ///Chat Mute
            "chatMute": {
                "staffs": [],
                "cmuteRoles": ['836467875647848459'],
                "penalPoint": 20,
                "penalLimit": 1,
                "log": "836467895156211772",
            },

            ///Voice Mute
            "voiceMute": {
                "staffs": [],
                "vmuteRoles": ['836467875647848459'],
                "penalPoint": 20,
                "penalLimit": 0,
                "log": "836467895156211772",
            },

            ///Warn
            "warn": {
                "staffs": [],
                "warnRoles": [{
                    "warnCount": 1,
                    "warnRole": "836467874267922443", 
                }, {
                    "warnCount": 2,
                    "warnRole": "836467873618722866",
                }, {
                    "warnCount": 3,
                    "warnRole": "836467872665829378",
                }],
                "penalPoint": 10,
                "log": "836467895156211772",
            },

        },

        ///Registration
        "registration": {
            "unregisterName": "",
            "unregisterRoles": ["836467876432445470"],
            "unregisterChannel": "",
            "quarantineRole": "",
            "familyRole": "",
        },

        ///Forbidden Tag
        "forbiddenTag": {
            "forbidRoles": ['836467875647848459'],
            "forbidChannel": "836467895156211772",
            "forbidLog": "836467895156211772",
        },

        ///Logs
        "logs": {
            "pointLog": "836467895156211772",
            "voiceLog": "836467895156211772",
            "messageLog": "836467895156211772",
            "buttonLog": "836467895156211772",
            "securityLog": "836467895156211772",
        },

    };

};