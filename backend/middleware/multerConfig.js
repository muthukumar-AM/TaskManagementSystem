// middleware/multerConfig.js
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/', // Set your desired upload directory
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  }
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // Limit file size if necessary
}).single('companyLogo'); // 'companyLogo' should match the field name in your form

module.exports = upload;
