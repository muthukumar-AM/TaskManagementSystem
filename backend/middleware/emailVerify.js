const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Company =require('../models/company/companymodel');
const TempRegistration=require('../models/company/tempRegistration');
const roles = require('./roles');

const verifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    console.error('No token provided');
    return res.status(400).json({ message: 'Invalid or missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Retrieve registration data from the temporary collection
    const registrationData = await TempRegistration.findOne({ email });
    if (!registrationData) {
      console.error(`No registration data found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid or expired registration data. Please re-register.' });
    }

    // Ensure the email is not already registered
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      console.error(`Company already exists for email: ${email}`);
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // Create and save the new company
    const newCompany = new Company({
      companyId: registrationData.companyId,
      companyName: registrationData.companyName,
      service: registrationData.service,
      phoneNo: registrationData.phoneNo,
      email: registrationData.email,
      password: hashedPassword,
      address: registrationData.address,
      role: 'company',
      permissions: roles['company'],
      companyLogo: registrationData.companyLogoPath
    });

    await newCompany.save();
    console.log(`Company registered successfully for email: ${email}`);

    // Remove registration data from the temporary collection after successful registration
    const deletionResult = await TempRegistration.deleteOne({ email });
    if (deletionResult.deletedCount === 0) {
      console.warn(`No registration data deleted for email: ${email}`);
    }

    return res.status(201).json({ success:'true',message: 'Company registered successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error(`Token expired for email: ${email}`);
      return res.status(400).json({success:'true', message: 'Verification link expired. Please re-register.' });
    }
    console.error('Error verifying email:', error.message);
    return res.status(500).json({success:'false', message: 'Error verifying email' });
  }
};

module.exports = {
  verifyEmail
};
