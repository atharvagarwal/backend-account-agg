const express = require("express");
const Bank = require("../models/Bank");
const User = require("../models/User");
const UserLoan = require("../models/UserLoan");

const router = express.Router();

router.patch("/addDetails", async (req, res) => {
  const { expenses, savings, taxUrl, portfolioUrl, bankName, mobileNo,loanAmt,type } =
    req.body;
  if (!expenses || !savings || !taxUrl || !portfolioUrl || !bankName) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    const user = await User.findOne({ mobileNo });
    if (!user) {
      return res.status(422).json({ error: "User Not Found" });
    }

    const bank = await Bank.findOne({
      IFSCcode: bankName,
    });

    if (!bank) {
      return res.status(422).json({ error: "Invalid IFSC code" });
    }

    user.expense = expenses;
    user.savings = savings;
    user.taxUrl = taxUrl;
    user.portfolioUrl = portfolioUrl;
    
    const userLoan = new UserLoan({
      IFSCcode: bankName,
      loanAmount: loanAmt,
      type:type,
      userId: user._id,
      approved: false,
      verified:true
    });

    await userLoan.save();

    await user.save();

    
    const bankIFSCcode = bank.IFSCcode;

    res.json({ message: "Details added successfully", ISFC: bankIFSCcode });
  } catch (e) {
    console.log(e);
  }
});

router.get("/getBanks", async (req, res) => {
  const banks = await Bank.find();
  res.json({ banks });
});

router.get("/getAppliedUsers/:bankIFSCcode", async (req, res) => {
  const bankIFSCcode = req.params.bankIFSCcode;
  const userLoans = await UserLoan.find();

  const appliedUsers = userLoans.filter((userLoan) => {
    return userLoan.IFSCcode === bankIFSCcode;
  });

  // get user for each userLoan

  const finalUsers = appliedUsers.map(async (userLoan) => {
    const user = await User.findById(userLoan.userId);
    if (user) {
      console.log(userLoan)
      return {
        loanAmount: userLoan.loanAmount,
        approved: userLoan.approved,
        loanId: userLoan._id,
        type:userLoan.type,
        user: user,
      };
    }
  });

  const fin = await Promise.all(finalUsers);
 

  return res.json({ appliedUsers: fin });           
});

router.post("/approveLoan", async (req, res) => {
  const { loanId} = req.body;
  const userLoan = await UserLoan.findById(loanId);
  userLoan.approved = true;
 
  await userLoan.save();
  res.json({ message: "Loan Approved" });
});

module.exports = router;
