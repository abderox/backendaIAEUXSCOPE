const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const personShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: "string",
    required: true,
    unique: true,
    match:
      /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  },
  password: { type: "string", required: true },
  isDoctor: { type: "boolean" },
  idProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
personShema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Person", personShema);
