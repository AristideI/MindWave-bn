//==============================
// REQUIRES
//==============================
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const parser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

// CONNECT  DATABASE
// mongoose.connect("mongodb://127.0.0.1:27017/mindwave", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected successfully");
  } catch (err) {
    console.log("We had an error", err);
  }
};

connectDB();
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
app.use(
  require("express-session")({
    secret: "mind wave",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

//==============================
// AUTH ROUTES
//==============================

app.post("/signup", (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then((user) => {
      passport.authenticate("local")(req, res, () => {
        console.log("New user added");
      });
    })
    .catch((err) => console.log(err));
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed and fuck u" });
    }

    User.findOne({ username: user.username })
      .then((foundUser) => {
        console.log("This runned");
        res.json(foundUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  })(req, res, next);
});

//===========================================
//POST ROUTE
//===========================================

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

app.post("/comment", (req, res) => {
  Post.findById(req.body.id)
    .then((post) => {
      Comment.create(req.body.comment).then((comment) => {
        post.comments.push(comment);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//==============================
// SERVER LISTENS
//==============================

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log("mind wave server has started", PORT);
});
