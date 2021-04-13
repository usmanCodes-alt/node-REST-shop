const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result) {
        return res.status(409).json({ message: "Email already taken!" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).send("Cant store password");
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hashedPassword,
            });
            console.log(user);
            user
              .save()
              .then((result) => {
                return res.status(201).json({ message: "User created!" });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
              });
          }
        });
      }
    });
});

router.post("/login", (req, res) => {
  // create a token
  User.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        // no user
        return res.status(401).json({ message: "Invalid email or password!" });
      }
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) {
          return res.status(401).json({ message: "Auth failed" });
        }
        if (response) {
          //correct password
          const token = jwt.sign(
            { email: result[0].email, userId: result[0]._id },
            "SECRET", // needs to be stored in process.env file
            { expiresIn: "1h" }
          );
          return res
            .status(200)
            .json({ message: "Auth success", token: token });
        }
        return res.status(401).json({ message: "Auth failed" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:userId", (req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .exec()
    .then((result) => {
      return res.status(200).json({ message: "User deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
