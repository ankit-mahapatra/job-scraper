const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload: cloudUpload } = require('../middleware/cloudinary');
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadImage,
  deleteImage,
  uploadResume,
  deleteAccount
} = require('../controllers/profileController');

// Resume multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const resumeUpload = multer({ storage });

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/image', auth, cloudUpload.single('image'), uploadImage);
router.delete('/image', auth, deleteImage);
router.post('/resume', auth, resumeUpload.single('resume'), uploadResume);
router.delete('/account', auth, deleteAccount);

module.exports = router;