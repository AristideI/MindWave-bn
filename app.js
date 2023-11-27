const express = require("express");
const app = express();
const mongoose = require("mongoose");
const parser = require("body-parser");
const Camp = require("./models/Camp");
const Comment = require("./models/Comment");
// const User = require("./models/User");
const seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

app.use(parser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Schema setup

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/camps", (req, res) => {
  const camps = Camp.find()
    .then((camps) => {
      res.render("camps", { camps });
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
});

app.post("/camps", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCamp = { name, image, description };
  Camp.create(newCamp)
    .then((camp) => {
      res.redirect("/camps");
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
});

app.get("/camps/new", (req, res) => {
  res.render("new");
});

app.get("/camps/:id", (req, res) => {
  const id = req.params.id;
  Camp.findById(id)
    .populate("comments")
    .exec()
    .then((camp) => {
      res.render("show", { camp });
    })
    .catch((err) => console.log(err));
});

// ============================================================
// Comments routes
// ============================================================

app.get("/camps/:id/comments/new", (req, res) => {
  Camp.findById(req.params.id)
    .then((camp) => {
      res.render("newComment", { camp });
    })
    .catch((err) => console.log(err));
});

app.post("/camps/:id/comments", (req, res) => {
  Camp.findById(req.params.id)
    .then((camp) => {
      Comment.create(req.body.comment).then((comment) => {
        camp.comments.push(comment);
        camp.save();
        res.redirect(`/camps/${camp._id}`);
      });
    })
    .catch((err) => console.log(err));
});

app.listen(3000, function () {
  console.log("yelp camp server has started");
});
