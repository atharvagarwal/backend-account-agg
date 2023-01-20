const express = require("express");
const User = require("../../models/User");
const Bank = require("../../models/Bank");
const bcrypt = require("bcrypt");
const validateAadhar = require("../../utils/validateAadhar");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World From Register!");
});

router.post("/", async (req, res) => {
  const body = req.body;
  const ROLE = body.role;
  if (ROLE === "USER") {
    const { aadharNo, panNo, mobileNo, password, aadharUrl, role, email} = body;

    if (!aadharNo || !panNo || !mobileNo || !password || !aadharUrl || !role) {
      return res.status(400).json({ message: "Please Enter All The Fields" });
    }

    // if (validateAadhar(aadharNo) === false) {
    //   return res
    //     .status(400)
    //     .json({ message: "Please Enter Valid Aadhar Number" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      aadharNo,
      panNo,
      mobileNo,
      password: hashedPassword,
      aadharUrl,
      email
    });

    await user.save();

    res.status(201).json({ success: "User Created Successfully" });
  } else if (ROLE === "BANK") {
    const { bankName, branchName, IFSCcode, password, mobileNo,logo } = body;

    if (!bankName || !branchName || !IFSCcode || !password || !mobileNo) {
      return res.status(400).json({ message: "Please Enter All The Fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const bank = new Bank({
      bankName,
      branchName,
      IFSCcode,
      password: hashedPassword,
      mobileNo,
      logo:logo
    });

    await bank.save();

    // send token in a HTTP-only cookie
    return res.status(201).json({ success: "Bank Created Successfully" });
  } else {
    return res.sendStatus(400);
  }
});

module.exports = router;
