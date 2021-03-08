const mongoose = require("mongoose");

const storySchema = mongoose.Schema({
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createDate: {type: Date, required: false}
});

module.exports = mongoose.model("Story", storySchema);