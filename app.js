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
const Like = require("./models/Like");
const Comment = require("./models/Comment");
const path = require("path");
const cors = require("cors");

app.use(cors());
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://aisingizwe:N6upWVMKU9rMcdNc@mind-wave.jkwtfzb.mongodb.net/mindwave?retryWrites=true&w=majority"
    );
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
// Names generator
//==============================

const verbs = [
  "Breathtaking",
  "Radiant",
  "Whimsical",
  "Majestic",
  "Serene",
  "Joyful",
  "Angry",
  "Vibrant",
  "Enchanting",
  "Captivating",
  "Mysterious",
  "Luminous",
  "Intriguing",
  "Soothing",
  "Elegant",
  "Resplendent",
  "Harmonious",
  "Exquisite",
  "Graceful",
  "Spectacular",
  "Happy",
  "Sad",
  "Effervescent",
  "Tranquil",
  "Mystical",
  "Jubilant",
  "Opulent",
  "Ravishing",
  "Dazzling",
  "Alluring",
  "Magical",
  "Awe-inspiring",
  "Delightful",
];

const animals = [
  "Lion",
  "Tiger",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Kangaroo",
  "Penguin",
  "Cheetah",
  "Koala",
  "Panda",
  "Gorilla",
  "Hippopotamus",
  "Leopard",
  "Kangaroo",
  "Polar Bear",
  "Dolphin",
  "Octopus",
  "Eagle",
  "Toucan",
  "Koala",
  "Penguin",
  "Koala",
  "Lynx",
  "Armadillo",
  "Chameleon",
  "Pangolin",
  "Meerkat",
  "Otter",
  "Raccoon",
];

//==============================
// ROUTES
//==============================

app.get("/", function (req, res) {
  res.status(200).json({ message: "Welcome to mind wave server" });
});

//==============================
// AUTH ROUTES
//==============================

app.post("/signup", async (req, res) => {
  const imgId = Math.ceil(Math.random() * 20);
  const firstname = Math.ceil(Math.random() * 29);
  const lastname = Math.ceil(Math.random() * 29);

  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username is already taken. Choose a different username.",
      });
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: `https://mind-wave.onrender.com/images/p${imgId}.jpeg`,
      displayName: verbs[firstname] + animals[lastname],
    });

    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Error during user registration.",
        });
      }

      passport.authenticate("local")(req, res, () => {
        return res.status(201).json({
          status: "success",
          message: "User registered successfully.",
          user: {
            username: user.username,
            email: user.email,
            image: user.image,
            id: user._id,
            displayName: user.displayName,
          },
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
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
app.use("/images", express.static("images"));
app.get("/post", (req, res) => {
  Post.find()
    .populate("comments")
    .populate("likes")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/post", (req, res) => {
  const images = {
    depressed: "https://mind-wave.onrender.com/images/dep.jpeg",
    suprissed: "https://mind-wave.onrender.com/images/sup.jpeg",
    broken: "https://mind-wave.onrender.com/images/dep2.jpeg",
    mad: "https://mind-wave.onrender.com/images/ang.jpg",
    happy: "https://mind-wave.onrender.com/images/hap.jpg",
    celebration: "https://mind-wave.onrender.com/images/cer.jpg",
    normal: "https://mind-wave.onrender.com/images/nor4.jpg",
  };
  const newPost = { ...req.body, image: images[req.body.mood] };
  Post.create(newPost)
    .then(() => {
      res.status(200).json({ message: "New post created" });
    })
    .catch((err) => console.log(err));
});

app.post("/comment", (req, res) => {
  const newComment = {
    author: req.body.author,
    authorImg: req.body.authorImg,
    text: req.body.text,
    time: req.body.time,
  };
  Post.findById(req.body.id)
    .then((post) => {
      Comment.create(newComment).then((comment) => {
        post.comments.push(comment);
        post.save();
      });
    })
    .then(() => {
      res.status(200).json({ message: "new comment created" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/like", (req, res) => {
  console.log(req.body.authorID, req.body.id);
  const newLike = {
    authorId: req.body.authorId,
  };
  Post.findById(req.body.id)
    .then((post) => {
      console.log(post);
      Like.create(newLike).then((like) => {
        console.log(like);
        post.likes.push(like);
        post.save();
      });
    })
    .then(() => {
      res.status(200).json({ message: "new like created" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Add a new route for deleting a like
app.delete("/like/:postId/:likeId", (req, res) => {
  const postId = req.params.postId;
  const likeId = req.params.likeId;

  Post.findById(postId)
    .then((post) => {
      const indexToRemove = post.likes.findIndex(
        (like) => like._id.toString() === likeId
      );

      if (indexToRemove !== -1) {
        // Remove the like from the post's likes array
        post.likes.splice(indexToRemove, 1);
        post.save();
        res.status(200).json({ message: "Like deleted successfully" });
      } else {
        res.status(404).json({ message: "Like not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//==============================
// SERVER LISTENS
//==============================

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log("mind wave server has started", PORT);
});
