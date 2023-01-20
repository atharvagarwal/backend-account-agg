const express = require("express");
const User = require("../../models/User");
const Bank = require("../../models/Bank");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World From Login!");
});

router.post("/", async (req, res) => {
  const role = req.body.role;
  if (role === "USER") {
    const { mobileNo, password } = req.body;
    if (!mobileNo || !password) {
      return res.status(400).json({ message: "Please Enter All The Fields" });
    }

    const user = await User.findOne({ mobileNo: mobileNo });

    if (!user) {
      return res.status(400).json({ message: "User Does Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } else {
      const token = jwt.sign(
        {
          id: user._id,
          role: "USER",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(201).json({
        success: "User Logged In",
        token: token,
        user: {
          aadharNo: user.aadharNo,
          mobileNo: user.mobileNo,
          id: user._id,
          profile:"USER",
          email: user.email
        },
      });
    }
  } else if (role === "BANK") {
    const { IFSCcode, password } = req.body;
    if (!IFSCcode || !password) {
      return res.status(400).json({ message: "Please Enter All The Fields" });
    }

    const bank = await Bank.findOne({ IFSCcode: IFSCcode });
    if (!bank) {
      
      return res.status(400).json({ message: "Bank Does Not Exist" });

    } else {
      const isMatch = await bcrypt.compare(password, bank.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        const token = jwt.sign(
          {
            id: bank._id,
            role: "BANK",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ 
          success:"user logged in",
          token: token,
          user: {
            bankName: bank.bankName,
            IFSCcode: bank.IFSCcode,
            branchName: bank.branchName,
            mobileNo: bank.mobileNo,
            profile:"BANK"
          },
        });
      }
    }
  }
});

module.exports = router;
