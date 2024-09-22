const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true }, // Unique constraint added
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique constraint added
  phone: { type: String, required: true },
  team: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  permissions: { type: [String], required: true },
  companyId: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const employee = mongoose.model('employee', employeeSchema);

module.exports = employee;
