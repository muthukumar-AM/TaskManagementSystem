const mongoose = require('mongoose');

const tempRegistrationSchema = new mongoose.Schema({
  companyId: String,
  companyName: String,
  service: String,
  email: { type: String, unique: true },
  phoneNo: String,
  address: String,
  password: String,
  companyLogoPath: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 } // TTL index to expire documents after 1 hour
});

const TempRegistration = mongoose.model('TempRegistration', tempRegistrationSchema);

module.exports = TempRegistration;
