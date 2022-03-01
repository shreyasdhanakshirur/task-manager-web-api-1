const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
   dateCreated: {
    type: Date,
    default: "",
  },
   dateModified: {
    type: Date,
    default: "",
  },
   status: {
    type: String,
    default: "",
  },
  subTasks: {
    type: Array,
    default: [],
  },
});

const tasks = mongoose.model("Tasks", TasksSchema);

module.exports = tasks;