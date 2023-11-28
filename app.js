//==============================
// REQUIRES
//==============================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const parser = require("body-parser");
const passport = require("passport");
const passportStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// CONNECT  DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/mindwave", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//==============================
// SETUP DB
//==============================
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

//==============================
// SETING  WHAT APP WILL USE
//==============================
app.use(parser.urlencoded({ extended: true }));

//==============================
// ROUTES
//==============================

app.get("/", function (req, res) {
  const sample = {
    name: "aristide",
    exp: "this is my first return of json data",
  };
  res.json(sample);
});

app.get("/post", (req, res) => {
  Post.find()
    .populate("Comment")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/post", (req, res) => {
  const newPost = req.body.post;
  User.findById(req.body.id)
    .then((user) => {
      Post.create(newPost)
        .then((post) => {
          user.posts.push(post);
        })
        .then(() => {
          res.status(200).json({ text: "new post was created" });
        });
    })
    .catch((err) => res.status(500).json({ error: "Internal Server Error" }));
});

//==============================
// SERVER LISTENS
//==============================
app.listen(3000, function () {
  console.log("yelp camp server has started");
});
