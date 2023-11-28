const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  text: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
