const { Schema, model } = require("mongoose");

const alarms = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  channelID: { type: String, default: "" },
  reason: { type: String, default: "" },
  startDate: { type: Number, default: Date.now() },
  finishDate: { type: Number, default: Date.now() }, 
  finished: { type: Boolean, default: false }
});

module.exports = model("alarms", alarms);