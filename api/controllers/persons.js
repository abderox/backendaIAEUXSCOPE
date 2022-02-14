const mongoose = require("mongoose");
const flash = require("connect-flash");
const Person = require("../models/person");
const Profile = require("../models/profile");
const passport = require("passport");
const bcrypt = require("bcrypt");
const fs = require("fs");
exports.register = (req, res, next) => {
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.file);
  Person.find({ email: req.body.email })
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
        req.flash("error", "the email already exist!");
        res.redirect("/register");
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            req.flash("error", "error was occured try later !");
            res.redirect("/register");
          } else {
            const profile = new Profile({
              _id: new mongoose.Types.ObjectId(),
              fullName: req.body.fullName,
              phone: req.body.phone,
              imagePath:
                "http://localhost:1234/" + req.file.path.replace("\\", "/"),
            });
            console.log(req.body);
            profile
              .save()
              .then((Result) => {
                console.log(profile);
                var check = req.body.isDoctor === "true" ? true : false;
                console.log(check);
                console.log("success");
                Person.register(
                  new Person({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.email,
                    email: req.body.email,
                    password: req.body.password,
                    isDoctor: check,
                    idProfile: Result._id,
                    idUser: null,
                  }),
                  req.body.password,
                  function (err, user) {
                    if (err) {
                      req.flash("error", "error was occured try later !" + err);
                      res.redirect("/register");
                    }
                    passport.authenticate("local")(req, res, function () {
                      res.redirect("/");
                    });
                  }
                );
              })
              .catch((error) => {
                req.flash("error", "error was occured try later !" + error);
                res.redirect("/register");
              });
          }
        });
      }
    })
    .catch((err) => {
      req.flash("error", "error was occured try later !" + err);
      res.redirect("/register");
    });
};
exports.addYeild = (req, res) => {};
exports.get = (req, res) => {
  res.status(200).json({
    result: "its work",
  });
};
