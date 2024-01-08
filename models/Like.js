const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  authorId: String,
});

module.exports = mongoose.model("Like", likeSchema);
