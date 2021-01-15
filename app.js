// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ejs = require("ejs");
const { Login, User } = require("./models/Users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config({ path: "./config/.env" });
require("./config/passport")(passport);
let port = process.env.PORT;
const app = express();
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(Login.createStrategy());

app.use(passport.initialize());
app.use(passport.session());

connectDB();

// loginSchema.plugin(passportLocalMongoose);

mongoose.set("useCreateIndex", true);

app.use("/", require("./routes/request"));
app.use("/auth", require("./routes/auth"));

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server is running");
});
