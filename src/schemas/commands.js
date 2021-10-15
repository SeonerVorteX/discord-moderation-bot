const { Schema, model } = require("mongoose");

const commands = Schema({
  guildID: { type: String, default: "" },
  moderationCommands: { type: Array, default: [] },
  registerCommands: { type: Array }
});

module.exports = model("commands", commands);