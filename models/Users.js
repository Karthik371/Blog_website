const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const userSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
});

loginSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
const Login = mongoose.model("Login", loginSchema);

module.exports.Login = Login;
module.exports.User = User;
