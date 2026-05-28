const Application = require('../models/Application');

// Apply to job
exports.applyJob = async (req, res) => {
  try {
    const { jobTitle, company, platform, jobLink } = req.body;
    const application = await Application.create({
      user: req.user.id,
      jobTitle,
      company,
      platform,
      jobLink
    });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};