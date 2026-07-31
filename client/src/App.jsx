 import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [resumeText, setResumeText] = useState("");

  // Select resume
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setMessage("");
    setAnalysis("");
    setResumeText("");
  };

  // Test backend
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

  // Upload resume
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

  return (
    <div className="app">

      <header className="navbar">
        <div className="logo">
          AI Resume Analyzer
        </div>

        <button className="login-button">
          Login
        </button>
      </header>

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

          <div className="upload-box">

            <div className="upload-icon">
              📄
            </div>

            <h2>Upload Your Resume</h2>

            <p>Supported formats: PDF</p>

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
                <strong>Selected file:</strong>
                <br />
                {selectedFile.name}
              </div>
            )}

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>

          </div>

          <button
            className="test-button"
            onClick={testBackend}
            disabled={loading}
          >
            Test Backend Connection
          </button>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {analysis && (
            <div
              style={{
                marginTop: "30px",
                textAlign: "left",
                background: "#ffffff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
              }}
            >
              <h2>AI Resume Analysis</h2>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit"
                }}
              >
                {analysis}
              </pre>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;