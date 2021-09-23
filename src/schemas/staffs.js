const { Schema, model } = require("mongoose");

const staffs = Schema({
  guildID: { type: String, default: "" },
  authorID: { type: String, default: "" },
  staffName: { type: String, default: "" },
  staffs: { type: Array, default: [] },
  staffRoles: { type: Array, default: [] },
  date: { type: Number, default: Date.now() },
});

module.exports = model("staffs", staffs);