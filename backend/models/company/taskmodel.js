const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  priority: String,
  assignedTo: String,
  assignedBy: String,
  createdDate: String,
  status:String,
  companyId:String,
  email:String,
  
});

const task = mongoose.model('task', taskSchema);

module.exports = task;
