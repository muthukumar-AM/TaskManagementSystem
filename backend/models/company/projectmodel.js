// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  team: { type: [String], required: true },
  resources: { type: [String], required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  status:{type:String,required: true},
  companyId:{type:String}
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
