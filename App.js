const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const passportLocalMongoose = require("passport-local-mongoose");
const userRoutes = require("./api/routes/users");
const todoRoutes = require("./api/routes/todo");
const startupRoutes = require("./api/routes/startup");
const bodyParser = require("body-parser");
const Person = require("./api/models/person");
const flash = require("connect-flash");
var path = require("path");
const mongoose = require("mongoose");
try {
  dotenv = require("dotenv");
} catch (error) {
  console.log("disabled dotenv problem");
}

dotenv.config({
  path: "./config/config.env",
});

const url = process.env.MONGO_URI;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
app.use(express.static(path.join(__dirname, "./api/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./api/views/pages"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// choose clients ...
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin; X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (res.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH, DELE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    Person.authenticate()
  )
);
passport.serializeUser(Person.serializeUser());
passport.deserializeUser(Person.deserializeUser());
//routes  ....
app.use("/users", userRoutes);
app.use("/todo", todoRoutes);
app.use("/", startupRoutes);
//errors handling ....
app.use((req, res, next) => {
  const error = new Error("Not found ");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
