const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const sessionMiddleware = require('./middleware/sessionConfig');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors({
  origin: process.env.BASE_URL || 'https://taskmanagementsystem-1-x4yq.onrender.com', // Replace with your client URL
  credentials: true // Allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the frontend's build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve index.html for all routes not handled by the API
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Define Routes
app.use('/api', require('./routes/companyRoutes'));


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
