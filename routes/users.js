const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const config = require("config");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Item Model
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
// route get api/users, register new user,
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  // simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // checks for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });
    const newUser = new User({
      name,
      email,
      password
    });
    // create salt and hash to secure password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            jwt.sign(
              { id: user.id },
              JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    name: user.name,
                    id: user.id,
                    email: user.email
                  }
                });
              }
            );
          })
          .catch();
      });
    });
  });
});

module.exports = router;
