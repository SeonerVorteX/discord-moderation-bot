const { Schema, model } = require("mongoose");

const forbiddenTag = Schema({
	guildID: { type: String, default: "" },
	forbiddenTags: { type: Array, default: [] },
});

module.exports = model("forbiddenTag", forbiddenTag);