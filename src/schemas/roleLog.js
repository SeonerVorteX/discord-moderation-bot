const { Schema, model } = require("mongoose");

const roleLog = Schema({
    type: { type: String, default: ""},
    guildID: { type: String, default: "" },
    staffID: { type: String, default: "" },
    userID: { type: String, default: "" },
    roleID: { type: String, default: "" },
    date: Number,
});

module.exports = model("roleLog", roleLog);