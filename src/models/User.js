const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  aadharNo: {
    type: String,
    required: true,
  },
  panNo: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  aadharUrl: {
    type: String,
    required: true,
  },
  expense: {
    type: String,
  },
  savings: {
    type: String,
  },
  taxUrl: {
    type: String,
  },
  portfolioUrl: {
    type: String,
  },
  email:{
    type: String,
  }
});

module.exports = mongoose.model("User", userSchema);
