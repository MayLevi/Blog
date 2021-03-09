const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      isAdmin: false
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id

      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.get("", (req, res, next) => {
  User.find().then(users => {
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  });
});

router.put(
  "/:id",
  (req, res, next) => {
    const user = new User({
      _id: req.body.id,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    });
    User.updateOne({ _id: req.body.id }, user).then(result => {
      res.status(200).json({message: "Update successful!"});
    });
  }
);

router.delete("/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(result => {
    if(result.n>0) {
      res.status(200).json({message: "Update successful!"});
    }else{
      res.status(401).json({message: "Not"});
    }
  });
});

module.exports = router;
