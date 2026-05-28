const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload: cloudUpload, uploadResume: cloudResumeUpload } = require('../middleware/cloudinary');
const {
  getProfile,
  updateProfile,
  uploadImage,
  deleteImage,
  uploadResume,
  deleteAccount
} = require('../controllers/profileController');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/image', auth, cloudUpload.single('image'), uploadImage);
router.delete('/image', auth, deleteImage);
router.post('/resume', auth, cloudResumeUpload.single('resume'), uploadResume);
router.delete('/account', auth, deleteAccount);

module.exports = router;