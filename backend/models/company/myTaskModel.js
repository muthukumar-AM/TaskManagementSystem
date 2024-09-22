const mongoose = require('mongoose');

const myTask = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true },
  assignedTo: { type: String, required: true },
  assignedBy: { type: String, required: true },
  comment: { type: String },
  status: { type: String },
});

module.exports = mongoose.model('Task', myTask);
