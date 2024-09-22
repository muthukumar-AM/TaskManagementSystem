const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyId: String,
  companyName: String,
  service: String,
  email: String,
  phoneNo: String,
  address: String,
  password: String,
  companyLogo: String,
  role: { type: String, default: 'company' }, // Example: 'admin', 'user', 'company', etc.
  permissions: [String], // Example: ['read', 'write', 'delete']
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
