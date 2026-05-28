const User = require('../models/User');
const { cloudinary } = require('../middleware/cloudinary');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile image
exports.uploadImage = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Delete profile image
exports.deleteImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`jobscraper/${publicId}`);
    }
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: '' },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    const resumePath = req.file.path;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: resumePath },
      { new: true }
    ).select('-password');
    res.json({ message: 'Resume uploaded!', resume: resumePath });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};