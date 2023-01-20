const mongoose = require("mongoose");

const userLoanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  IFSCcode: {
    type: String,
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  verified:{
    type: Boolean,
    default: false,
  },
  type:{
    type: String
  }
});

module.exports = mongoose.model("UserLoan", userLoanSchema);
