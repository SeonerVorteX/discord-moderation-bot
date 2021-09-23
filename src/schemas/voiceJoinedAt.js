const { Schema, model } = require("mongoose");

const voiceJoinedAt = Schema({
    userID: { type: String, default: "" },
    guildID: { type: String, default: "" },
    date: Number,
});

module.exports = model("voiceJoinedAt", voiceJoinedAt);