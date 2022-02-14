const express = require("express");
const Person = require("../models/person");
const Profile = require("../models/profile");
const User = require("../models/user");
const Task = require("../models/Todo");
const personController = require("../controllers/persons");
const passport = require("passport");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("work");
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    var str = file.mimetype.toString();
    cb(null, Date.now().toString() + ".jpg");
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const router = express.Router();
var session;
var isLogged = false;
router.get("/", function (req, res) {
  session = req.session;
  if (req.user) {
    session.email = req.user.email;
    isLogged = true;
  }

  if (session.email && session.visits) {
    getPage(res, "index", new Object());
  } else {
    session.visits = 1;
    getPage(res, "index");
  }
});
router.get("/login", function (req, res) {
  var data = new Object();
  const error = req.flash("error");
  data.error = error;
  getPage(res, "login", data);
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/er",
  }),
  function (req, res) {}
);
router.get("/er", function (req, res) {
  req.flash("error", "the email or password is incorrect !");
  res.redirect("/login");
});
router.get("/register", function (req, res) {
  var data = new Object();
  const error = req.flash("error");
  data.error = error;
  getPage(res, "register", data);
});
router.post(
  "/register",
  upload.single("personImage"),
  personController.register
);

router.get("/addYeild", function (req, res) {
  Person.find({ email: session.email })
    .exec()
    .then((document) => {
      if (document) {
        var idUser = document[0].idUser;
        if (idUser) {
          req.flash("idUser", idUser);
          res.redirect("/task");
        } else {
          getPage(res, "addYeild", new Object());
        }
      } else {
        res.status(200).json({ message: "error" });
      }
    });
});

router.post("/addYeild", function (req, res) {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        const idUser = user[0]._id;
        Person.find({ email: session.email })
          .exec()
          .then((person) => {
            const idPerson = person[0]._id;
            Person.update({ _id: idPerson }, { $set: { idUser: idUser } })
              .exec()
              .then((result) => {
                console.log(result);
                res.redirect("/task");
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          });
      } else {
        req.flash("error", "the data selected is invalid !");
        res.redirect("/addYeild");
      }
    });
});
//about
router.get("/about", function (req, res) {
  getPage(res, "about", new Object());
});
//chat
router.get("/chat", function (req, res) {
  getPage(res, "chat", new Object());
});
router.get("/task", function (req, res) {
  Task.find({}, function (err, task) {
    if (err) {
      console.log("Error in fetching tasks from db");
      return;
    }
    const newTask = task.filter((t) => {
      if (t.idPerson) {
        return t;
      }
    });
    var data = new Object();
    data.task = newTask;
    getPage(res, "task", data);
  });
});
router.post("/create-task", function (req, res) {
  console.log(req.body);
  Person.find({ email: session.email })
    .exec()
    .then((document) => {
      if (document) {
        var idUser = document[0].idUser;
        var _idPerson = document[0]._id;
        Task.create(
          {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            date: req.body.date,
            user: idUser,
            idPerson: _idPerson,
          },
          function (err, newtask) {
            if (err) {
              console.log("error in creating task", err);
              return;
            }

            //console.log(newtask);
            return res.redirect("back");
          }
        );
      } else {
        res.redirect("back");
      }
    });
});

// deleting Tasks
router.get("/delete-task", function (req, res) {
  // get the id from query
  var id = req.query;

  // checking the number of tasks selected to delete
  var count = Object.keys(id).length;
  for (let i = 0; i < count; i++) {
    // finding and deleting tasks from the DB one by one using id
    Task.findByIdAndDelete(Object.keys(id)[i], function (err) {
      if (err) {
        console.log("error in deleting task");
      }
    });
  }
  return res.redirect("back");
});
//logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    isLogged = false;
    res.redirect("/");
  });
});

function getPage(res, pageName, data) {
  var Data = { person: null, islogged: isLogged, ...data };
  if (isLogged) {
    Person.find({ email: session.email })
      .exec()
      .then((document) => {
        if (document) {
          Profile.findById(document[0].idProfile)
            .exec()
            .then((profile) => {
              const _person = {
                email: document[0].email,
                fullName: profile.fullName,
                phone: profile.phone,
                isDoctor: document[0].isDoctor,
                imagePath: profile.imagePath,
              };
              Data.person = _person;
              res.render(pageName, { data: Data });
            });
        } else {
          res.status(200).json({ message: "error" });
        }
      });
  } else {
    res.render(pageName, { data: Data });
  }
}
module.exports = router;
