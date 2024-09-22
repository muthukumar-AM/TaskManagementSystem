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
  origin: process.env.BASE_URL || 'http://localhost:3000', // Replace with your client URL
  credentials: true // Allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Define Routes
app.use('/api', require('./routes/companyRoutes'));


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
