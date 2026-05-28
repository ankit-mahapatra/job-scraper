const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://job-scraper-frontend.vercel.app'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Job Scraper API is running!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/application'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/scrape', require('./routes/scrape'));


// DB Connection + Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));