const express = require("express");
const session = require("express-session");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/main",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/main");
  }
);

module.exports = router;
