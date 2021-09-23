const mongoose = require("mongoose");
const { MongoURL } = global.client.settings;

mongoose.connect(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => console.log("[DATABASE] Connected To Database"));
mongoose.connection.on("error", () => console.error("[DATABASE] Failed To Connect Database"));