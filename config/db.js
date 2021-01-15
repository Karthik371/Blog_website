const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(
    "mongodb+srv://Admin-Karthik:cenathejhn@cluster0.semtp.mongodb.net/LoginDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

module.exports = connectDB;
