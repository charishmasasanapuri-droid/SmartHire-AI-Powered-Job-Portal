import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // Upload Resume
  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please select a PDF or DOCX resume.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await API.post("/ai/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeText(res.data.resumeText);

      alert("Resume uploaded successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Resume Upload Failed");
    }
  };

  // Analyze Resume
  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      alert("Please upload or paste your resume.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/ai/analyze-resume", {
        resumeText,
      });

      setAnalysis(res.data.analysis);
    } catch (error) {
      alert(error.response?.data?.message || "Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          width: "80%",
          margin: "40px auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🤖 AI Resume Analyzer
        </h1>

        {/* Upload Resume */}

        <div style={{ marginTop: "20px" }}>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />

          <button
            onClick={uploadResume}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Upload Resume
          </button>
        </div>

        {/* Resume Text */}

        <textarea
          rows="15"
          placeholder="Paste your resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            marginTop: "20px",
          }}
        />

        {/* Analyze Button */}

        <button
          onClick={analyzeResume}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* AI Analysis */}

        {analysis && (
          <div
            style={{
              marginTop: "30px",
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
              background: "#f9f9f9",
              whiteSpace: "pre-wrap",
            }}
          >
            <h2>AI Analysis</h2>

            <p>{analysis}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ResumeAnalyzer;