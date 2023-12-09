const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  username: String,
  authorId: String,
  authorImg: String,
  text: String,
  time: String,
  likes: Number,
  image: String,
  mood: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
