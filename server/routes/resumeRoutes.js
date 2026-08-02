 const express = require("express");
const router = express.Router();

const {
  getResumeHistory,
} = require("../controllers/resumeController");

// ===============================
// Get Resume History of a User
// ===============================
router.get("/history/:userId", getResumeHistory);

module.exports = router;