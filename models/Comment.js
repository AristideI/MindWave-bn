const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  authorImg: String,
  image: String,
  text: String,
});

module.exports = mongoose.model("Comment", commentSchema);
