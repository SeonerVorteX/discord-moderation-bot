const { Schema, model } = require("mongoose");

const administrators = Schema({
  type: { type: String, default: "" },
  guildID: { type: String, default: "" },
  roleID: { type: String, default: "" },
  userID: { type: String, default: "" },
  userRoles: { type: Array, default: [] },
  roleMembers: { type: Array, default: [] },
  reason: { type: String, default: "Belirtilmedi!" },
});

module.exports = model("administrators", administrators);