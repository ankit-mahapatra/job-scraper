const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { applyJob, getApplications } = require('../controllers/applicationController');

router.post('/apply', auth, applyJob);
router.get('/', auth, getApplications);

module.exports = router;