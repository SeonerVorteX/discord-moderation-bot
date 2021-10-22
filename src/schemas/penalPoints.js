const { Schema, model } = require("mongoose");

const penalPoints = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  penalPoint: { type: Number, default: "" },
});

module.exports = model("penalPoints", penalPoints);