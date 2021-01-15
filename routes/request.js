const express = require("express");
const { Login, User } = require("../models/Users");
var ObjectId = require("mongodb").ObjectID;
const router = express.Router();
const passport = require("passport");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", function (req, res) {
  const user = new Login({
    username: req.body.username,
    password: req.body.password,
  });
  const { username, password } = req.body;

  let errors = [];

  if (!username || !password) {
    errors.push({
      msg: "fill all the fields",
    });
  }
  if (password.length < 6) {
    errors.push({
      msg: "password must be long",
    });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("login", { username, password, errors });
  } else {
    req.login(user, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/main");
        });
      }
    });
  }
});

router.get("/main", (req, res) => {
  if (req.isAuthenticated()) {
    User.find({}, function (err, posts) {
      res.render("list", { posts: posts });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", function (req, res) {
  const usern = req.body.user;
  const { user, username, password, password2 } = req.body;

  let errors = [];

  if (!user || !username || !password) {
    errors.push({
      msg: "fill all the fields",
    });
  }
  if (password.length < 6) {
    errors.push({
      msg: "password must be long",
    });
  }
  if (password !== password2) {
    errors.push({
      msg: "Passwords dont match",
    });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render("register", { user, username, password, errors });
  } else {
    Login.register({ username: username }, password, function (err, user) {
      if (err) {
        console.log(err);
        errors.push({ msg: "Email already exists already exists" });
        res.render("register", { user, username, password, errors });
      } else {
        passport.authenticate("local")(req, res, function (err) {
          res.redirect("/main");
        });
      }
    });
  }
});

router.get("/create", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("create");
  } else {
    res.redirect("/");
  }
});
router.post("/create", (req, res) => {
  const items = new User({
    title: _.capitalize(req.body.username),
    content: req.body.textarea,
  });
  items.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/main");
    }
  });
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.post("/delete", (req, res) => {
  const myId = _.capitalize(req.body.item);

  User.findByIdAndRemove(myId, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/main");
    }
  });
});

router.get("/posts/:postid", (req, res) => {
  const urlId = _.capitalize(req.params.postid);
  User.findOne({ _id: urlId }, function (err, founditem) {
    if (!err) {
      res.render("read", {
        title: founditem.title,
        content: founditem.content,
      });
    }
  });
});

router.get("/users/:userid", (req, res) => {
  const userUrl = _.capitalize(req.params.userid);
  User.findOne({ _id: userUrl }, function (err, founditem) {
    if (!err) {
      res.render("read", {
        title: founditem.title,
        content: founditem.content,
      });
    }
  });
});
router.get("/user/:name", (req, res) => {
  const user = _.capitalize(req.params.name);
  User.find({ title: user }, function (err, founduser) {
    if (err) {
      console.log(err);
    } else {
      res.render("Users", { founduser, user });
    }
  });
});

router.get("/about", (req, res) => {
  res.render("About");
});

router.get("/search", (req, res) => {
  res.render("search");
});

router.post("/search", (req, res) => {
  const searchedName = _.capitalize(req.body.search);

  User.find({ title: searchedName }, function (err, founduser) {
    if (!err) {
      res.render("Users", { founduser, user: searchedName });
    }
  });
});
module.exports = router;
