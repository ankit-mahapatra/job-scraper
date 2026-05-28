const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { scrapeJobs } = require('../controllers/scrapeController');

router.get('/', auth, scrapeJobs);

module.exports = router;