import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Jobs() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);

  // Search & Filters
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [sort, setSort] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  fetchJobs();
}, [keyword, company, location, salary, sort, page]);

  // Reset page when filters change
  useEffect(() => {
  setPage(1);
}, [keyword, company, location, salary, sort]);

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
     const res = await API.get(
  `/jobs?keyword=${keyword}&company=${company}&location=${location}&salary=${salary}&sort=${sort}&page=${page}`
);

      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.log(error);
    }
  };

  // Apply Job
  const applyJob = async (jobId) => {
    if (!resume) {
      alert("Please select your resume first.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("job", jobId);
      formData.append("applicant", localStorage.getItem("userId"));
      formData.append("resume", resume);

      const res = await API.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      setResume(null);
    } catch (error) {
      alert(error.response?.data?.message || "Application Failed");
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      const res = await API.delete(`/jobs/${id}`);

      alert(res.data.message);

      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting job");
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
        <h1 style={{ textAlign: "center" }}>Available Jobs</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by Job Title..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "16px",
          }}
        />

       {/* Filters */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="🏢 Company"
    value={company}
    onChange={(e) => setCompany(e.target.value)}
    style={{
      padding: "12px",
      fontSize: "16px",
    }}
  />

  <input
    type="text"
    placeholder="📍 Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    style={{
      padding: "12px",
      fontSize: "16px",
    }}
  />

  <input
    type="number"
    placeholder="💰 Minimum Salary"
    value={salary}
    onChange={(e) => setSalary(e.target.value)}
    style={{
      padding: "12px",
      fontSize: "16px",
    }}
  />

  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    style={{
      padding: "12px",
      fontSize: "16px",
    }}
  >
    <option value="newest">🆕 Newest</option>
    <option value="oldest">🕒 Oldest</option>
    <option value="salary-high">💰 Highest Salary</option>
    <option value="salary-low">💵 Lowest Salary</option>
  </select>
</div>

<hr />

        {jobs.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>No Jobs Available</h3>
        ) : (
          <>
            {jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "20px",
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

               {/* Resume Upload (Job Seeker Only) */}

{role !== "employer" && (
  <div style={{ marginTop: "15px" }}>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={(e) => setResume(e.target.files[0])}
    />
  </div>
)}

<div style={{ marginTop: "15px" }}>
  {/* Apply Button (Job Seeker Only) */}

  {role !== "employer" && (
    <button
      onClick={() => applyJob(job._id)}
      style={{
        marginRight: "10px",
        padding: "8px 15px",
        cursor: "pointer",
      }}
    >
      Apply
    </button>
  )}

  {/* Employer Buttons */}

  {role === "employer" && (
    <>
      <button
        onClick={() => navigate(`/edit-job/${job._id}`)}
        style={{
          background: "green",
          color: "white",
          border: "none",
          padding: "8px 15px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Edit
      </button>

      <button
        onClick={() => deleteJob(job._id)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "8px 15px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </>
  )}
</div>
              </div>
            ))}

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                style={{
                  padding: "10px 20px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                ⬅ Previous
              </button>

              <h3>
                Page {page} of {totalPages}
              </h3>

              <button
  onClick={() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }}
  disabled={page === totalPages}
  style={{
    padding: "10px 20px",
    cursor: page === totalPages ? "not-allowed" : "pointer",
  }}
>
  Next ➡
</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Jobs;