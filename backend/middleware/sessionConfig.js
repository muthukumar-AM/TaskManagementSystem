const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, // This allows sessions to be saved even if they are new and unmodified
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 180 * 60 * 1000 // 3 hours
  }
});
