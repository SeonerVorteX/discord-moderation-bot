const { Schema, model } = require("mongoose");

const snipe = Schema({
  guildID: { type: String, default: "" },
  channelID: { type: String, default: "" },
  authorID: { type: String, default: ""},
  userID: { type: String, default: "" },
  messageContent: { type: String, default: "" },
  image: { type: String, default: "" },
  createdDate: Number,
  deletedDate: { type: Number, default: Date.now() }
});

module.exports = model("snipe", snipe);