import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function JobRecommendations() {
  const [resumeText, setResumeText] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const recommendJobs = async () => {
    if (!resumeText.trim()) {
      alert("Please paste your resume.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/ai/recommend-jobs", {
        resumeText,
      });

      setJobs(res.data.jobs);
    } catch (error) {
      alert(error.response?.data?.message || "Recommendation Failed");
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
          💼 AI Job Recommendation
        </h1>

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

        <div style={{ textAlign: "center" }}>
          <button
            onClick={recommendJobs}
            style={{
              marginTop: "20px",
              padding: "12px 30px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Finding Jobs..." : "Recommend Jobs"}
          </button>
        </div>

        {jobs.length > 0 && (
          <>
            <h2
              style={{
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              🎯 Recommended Jobs
            </h2>

            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  background: "#f9f9f9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h2>{job.title}</h2>

                <p>
                  <strong>🏢 Company:</strong> {job.company}
                </p>

                <p>
                  <strong>📍 Location:</strong> {job.location}
                </p>

                <p>
                  <strong>💰 Salary:</strong> ₹{job.salary}
                </p>

                <p>
                  <strong>📝 Description:</strong> {job.description}
                </p>

                <h3 style={{ marginTop: "20px" }}>
                  Resume Match: {job.matchScore}%
                </h3>

                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    background: "#ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${job.matchScore}%`,
                      height: "100%",
                      background:
                        job.matchScore >= 80
                          ? "#16a34a"
                          : job.matchScore >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                      transition: "0.5s",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && jobs.length === 0 && (
          <p
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            No recommendations yet.
          </p>
        )}
      </div>
    </>
  );
}

export default JobRecommendations;