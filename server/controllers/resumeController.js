const Resume = require("../models/resume");

// Get all resumes of a user
const getResumeHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getResumeHistory,
};