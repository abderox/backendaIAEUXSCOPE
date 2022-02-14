const mongoose = require("mongoose");
const User = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length < 1) {
        res.status(200).json({ result: "not" });
      } else {
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
          if (err) {
            return res.status(200).json({ result: "error" });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: users[0].email,
                userId: users[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "2h",
              }
            );

            return res.status(200).json({
              result: token,
            });
          }
          res.status(200).json({ result: "not" });
        });
      }
    })
    .catch((err) => {
      res.status(200).json({ resut: "error" });
    });
};
exports.register = (req, res, next) => {
  console.log(req.file);
  User.find({ email: req.body.email })
    .exec()
    .then((_result) => {
      if (_result.length >= 1) {
        let path =
          __dirname.substring(0, __dirname.length - 15) + req.file.path;
        try {
          fs.unlinkSync(path);
        } catch (err) {
          console.log("error: " + err);
        }
        console.log(path);
        res.status(200).json({
          result: "not",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(200).json({ result: "error" });
          } else {
            const profile = new Profile({
              _id: new mongoose.Types.ObjectId(),
              fullName: req.body.fullName,
              phone: req.body.phone,
              imagePath: req.file.path.replace("\\", "/"),
            });
            console.log(req.body);
            profile
              .save()
              .then((Result) => {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  password: hash,
                  idProfile: Result._id,
                });
                console.log(profile);
                user
                  .save()
                  .then((result) => {
                    const token = jwt.sign(
                      {
                        email: user.email,
                        userId: user._id,
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "2h",
                      }
                    );
                    res.status(200).json({
                      result: token,
                    });
                  })
                  .catch((error) => {
                    res.status(200).json({ result: "error" });
                  });
              })
              .catch((error) => {
                res.status(200).json({ result: "error" });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(200).json({ result: "error" });
    });
};
exports.get_profile = (req, res) => {
  User.findById(req.userData.userId)
    .exec()
    .then((document) => {
      if (document) {
        Profile.findById(document.idProfile)
          .exec()
          .then((profile) => {
            res.status(200).json({
              email: document.email,
              fullName: profile.fullName,
              phone: profile.phone,
              imagePath: profile.imagePath,
            });
          });
      } else {
        res.status(200).json({ message: "error" });
      }
    })
    .catch((err) => {
      res.status(200).json({ error: "error" });
    });
};
exports.get = (req, res) => {
  res.status(200).json({
    result: "its work",
  });
};
