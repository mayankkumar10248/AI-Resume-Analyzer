 const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const router = express.Router();

const upload = multer({
  dest: "uploads/"
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded"
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const resumeText = pdfData.text;

    console.log("=================================");
    console.log("RESUME TEXT EXTRACTED:");
    console.log(resumeText);
    console.log("=================================");

    res.json({
      message: "Resume text extracted successfully!",
      filename: req.file.originalname,
      text: resumeText
    });

  } catch (error) {
    console.error("PDF extraction error:", error);

    res.status(500).json({
      message: "Could not extract text from resume"
    });
  }
});

module.exports = router;