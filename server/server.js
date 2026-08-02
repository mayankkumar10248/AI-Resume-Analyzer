 const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const dotenv = require("dotenv");
 const Groq = require("groq-sdk");
const Resume = require("./models/Resume");

// NEW
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
 

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// =========================
// AUTH ROUTES
// =========================

app.use("/api/auth", authRoutes);

// =========================
// GROQ SETUP
// =========================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================
// Upload Folder
// =========================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// =========================
// Multer
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// =========================
// Routes
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer Backend Running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend Connected Successfully",
  });
});

// =========================
// Upload Resume + AI Analysis
// =========================

app.post("/api/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    console.log("====================================");
    console.log("Resume Uploaded:", req.file.originalname);

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    const resumeText = pdfData.text;

    console.log("PDF Text Extracted Successfully");

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume and provide the output in this exact format.

Resume Score:
(Score out of 100)

Technical Skills:
(List all technical skills)

Soft Skills:
(List all soft skills)

Strengths:
(Bullet points)

Weaknesses:
(Bullet points)

Missing Skills:
(Bullet points)

Suggestions:
(Bullet points to improve resume)

Resume:

${resumeText}
`;

    console.log("Sending Resume to Groq AI...");

    const chatCompletion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

     const analysis =
  chatCompletion.choices[0].message.content;

console.log("AI Analysis Completed");

// Save resume to MongoDB
const scoreMatch = analysis.match(/Resume Score\s*:\s*(\d+)/i);

const score = scoreMatch
  ? Number(scoreMatch[1])
  : 0;

await Resume.create({
  fileName: req.file.originalname,
  resumeText,
  analysis,
  score,
});

res.json({
  success: true,
  fileName: req.file.originalname,
  resumeText,
  analysis,
});

  } catch (error) {

    console.error("UPLOAD ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {

  console.error("====================================");
  console.error("SERVER ERROR");
  console.error(err);
  console.error("====================================");

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log("====================================");
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log("====================================");
});