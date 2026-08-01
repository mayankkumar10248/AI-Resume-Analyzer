 import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [resumeText, setResumeText] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setMessage("");
    setAnalysis("");
    setResumeText("");
  };

  const testBackend = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/test");
      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnalysis("");
      setResumeText("");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage(data.message);
      setResumeText(data.resumeText || "");
      setAnalysis(data.analysis || "");

      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract a section from the AI response
  const getSection = (title, nextTitles = []) => {
    if (!analysis) return "";

    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let endPattern = nextTitles.length
      ? `(?=\\n\\s*(?:${nextTitles
          .map((item) =>
            item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          )
          .join("|")})\\s*:?)`
      : "$";

    const regex = new RegExp(
      `${escapedTitle}\\s*:?\\s*([\\s\\S]*?)${endPattern}`,
      "i"
    );

    const match = analysis.match(regex);

    return match ? match[1].trim() : "";
  };

  const cleanItems = (text) => {
    if (!text) return [];

    return text
      .split("\n")
      .map((item) =>
        item
          .replace(/^[\s*•\-✓]+/, "")
          .trim()
      )
      .filter(Boolean);
  };

  const scoreMatch = analysis.match(
    /Resume Score\s*:\s*(\d+)/i
  );

  const score = scoreMatch ? Number(scoreMatch[1]) : null;

  const technicalSkills = cleanItems(
    getSection("Technical Skills", [
      "Strengths",
      "Weaknesses",
      "Missing Skills",
      "Suggestions",
    ])
  );

  const strengths = cleanItems(
    getSection("Strengths", [
      "Weaknesses",
      "Missing Skills",
      "Suggestions",
    ])
  );

  const weaknesses = cleanItems(
    getSection("Weaknesses", [
      "Missing Skills",
      "Suggestions",
    ])
  );

  const missingSkills = cleanItems(
    getSection("Missing Skills", ["Suggestions"])
  );

  const suggestions = cleanItems(
    getSection("Suggestions")
  );

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          AI Resume Analyzer
        </div>

        <button className="login-button">
          Login
        </button>
      </header>

      {/* HERO */}
      <main className="hero">

        <div className="hero-content">

          <div className="badge">
            AI-Powered Resume Analysis
          </div>

          <h1>
            Build a Better Resume
            <br />
            with <span>AI</span>
          </h1>

          <p className="description">
            Upload your resume and get AI-powered feedback,
            resume scoring, skill analysis and personalized
            suggestions.
          </p>

          {/* UPLOAD CARD */}
          <div className="upload-box">

            <div className="upload-icon">
              📄
            </div>

            <h2>Upload Your Resume</h2>

            <p>Supported format: PDF</p>

            <label className="choose-file-button">
              Choose Resume

              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="selected-file">
                <span>Selected file</span>
                <strong>{selectedFile.name}</strong>
              </div>
            )}

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading
                ? "Analyzing Resume..."
                : "Upload & Analyze"}
            </button>

          </div>

          {/* BACKEND TEST */}
          <button
            className="test-button"
            onClick={testBackend}
            disabled={loading}
          >
            Test Backend Connection
          </button>

          {/* MESSAGE */}
          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {/* RESULTS */}
          {analysis && (
            <section className="results-section">

              <div className="results-header">

                <span className="results-label">
                  AI RESULTS
                </span>

                <h2>
                  Resume Analysis
                </h2>

                <div className="analysis-status">
                  ✓ Analysis Complete
                </div>

              </div>

              {/* SCORE */}
              {score !== null && (
                <div className="score-card">

                  <div>
                    <span className="card-label">
                      RESUME SCORE
                    </span>

                    <h3>
                      {score}
                      <span>/100</span>
                    </h3>
                  </div>

                  <div className="score-circle">
                    {score}
                  </div>

                </div>
              )}

              {/* TECHNICAL SKILLS */}
              {technicalSkills.length > 0 && (
                <div className="result-card">

                  <div className="card-heading">
                    <span className="card-icon">
                      💻
                    </span>

                    <div>
                      <h3>Technical Skills</h3>
                      <p>
                        Technologies detected in your resume
                      </p>
                    </div>
                  </div>

                  <div className="skills-container">
                    {technicalSkills.map((skill, index) => (
                      <span
                        className="skill-tag"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              )}

              {/* STRENGTHS */}
              {strengths.length > 0 && (
                <div className="result-card">

                  <div className="card-heading">
                    <span className="card-icon">
                      💪
                    </span>

                    <div>
                      <h3>Strengths</h3>
                      <p>
                        What your resume does well
                      </p>
                    </div>
                  </div>

                  <div className="item-list">
                    {strengths.map((item, index) => (
                      <div
                        className="analysis-item"
                        key={index}
                      >
                        <span>✓</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* WEAKNESSES */}
              {weaknesses.length > 0 && (
                <div className="result-card">

                  <div className="card-heading">
                    <span className="card-icon">
                      ⚠️
                    </span>

                    <div>
                      <h3>Weaknesses</h3>
                      <p>
                        Areas that could be improved
                      </p>
                    </div>
                  </div>

                  <div className="item-list">
                    {weaknesses.map((item, index) => (
                      <div
                        className="analysis-item"
                        key={index}
                      >
                        <span>•</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* MISSING SKILLS */}
              {missingSkills.length > 0 && (
                <div className="result-card">

                  <div className="card-heading">
                    <span className="card-icon">
                      🎯
                    </span>

                    <div>
                      <h3>Missing Skills</h3>
                      <p>
                        Skills worth adding to your profile
                      </p>
                    </div>
                  </div>

                  <div className="skills-container">
                    {missingSkills.map((skill, index) => (
                      <span
                        className="missing-tag"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              )}

              {/* SUGGESTIONS */}
              {suggestions.length > 0 && (
                <div className="result-card">

                  <div className="card-heading">
                    <span className="card-icon">
                      💡
                    </span>

                    <div>
                      <h3>Suggestions</h3>
                      <p>
                        Personalized recommendations
                      </p>
                    </div>
                  </div>

                  <div className="item-list">
                    {suggestions.map((item, index) => (
                      <div
                        className="analysis-item"
                        key={index}
                      >
                        <span>→</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* FALLBACK */}
              {!technicalSkills.length &&
                !strengths.length &&
                !weaknesses.length &&
                !missingSkills.length &&
                !suggestions.length && (
                  <div className="result-card">

                    <h3>AI Analysis</h3>

                    <pre className="analysis-content">
                      {analysis}
                    </pre>

                  </div>
                )}

            </section>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;