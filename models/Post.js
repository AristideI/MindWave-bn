const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  authorId: String,
  text: String,
  time: String,
  likes: Number,
  image: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
