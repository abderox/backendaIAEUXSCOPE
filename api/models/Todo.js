const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  idPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
  },
  finished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
  },
});

module.exports = Todo = mongoose.model("todo", TodoSchema);
