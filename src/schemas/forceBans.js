const { Schema, model } = require("mongoose");

const forceBans = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  staffID: { type: String, default: "" }
});

module.exports = model("forceBans", forceBans);